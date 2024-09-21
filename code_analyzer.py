import sys
import os
import subprocess
import ast
import re
import pandas as pd
import shutil


def clone_repo(git_url, clone_dir):
    print(f"\nCloning Git repository from {git_url} to {clone_dir}...\n")
    try:
        subprocess.run(['git', 'clone', git_url, clone_dir], check=True)
    except subprocess.CalledProcessError as e:
        print(f"Error cloning repository: {e}")
        sys.exit(1)

# Function to delete cloned directory
def delete_directory(directory):
    print(f"\nDeleting directory: {directory}...\n")
    try:
        shutil.rmtree(directory)
    except Exception as e:
        print(f"Error deleting directory {directory}: {e}")

# Function to run cloc and count lines of code, comments, and blank lines
def run_cloc(directory='.'):
    print("\nRunning cloc to count lines of code, comments, and blank lines...\n")
    try:
        result = subprocess.run(['cloc', directory], capture_output=True, text=True)
        print(result.stdout)
    except FileNotFoundError:
        print("cloc is not installed. Please install cloc by running 'pip install cloc' or from the system package manager.")


# Class to calculate various metrics
class MetricsCalculator(ast.NodeVisitor):
    def __init__(self):
        self.class_metrics = {}
        self.current_class = None
        self.current_metrics = {}
        self.current_depth = 0
        self.max_depth = 0
        self.unique_words = set()
        self.words_pattern = re.compile(r'\b\w+\b')

    def visit_ClassDef(self, node):
        if self.current_class is not None:
            self.save_class_metrics()

        # Initialize metrics for the new class
        self.current_class = node.name
        self.current_metrics = {
            'dependencies': set(),
            'wmc': 0,
            'dit': 1,  # Initialize with 1, will update later
            'rfc': set(),
            'lcom': 0,
            'methods': set(),
            'fields': set(),
            'nosi': 0,
            'return_qty': 0,
            'loop_qty': 0,
            'comparisons_qty': 0,
            'try_catch_qty': 0,
            'parenthesized_exps_qty': 0,
            'string_literals_qty': 0,
            'numbers_qty': 0,
            'assignments_qty': 0,
            'math_operations_qty': 0,
            'variables_qty': 0,
            'maxNestedBlocks': 0,
            'uniqueWordsQty': 0
        }

        # Reset unique words set for new class
        self.unique_words = set()

        # Visit base classes to calculate DIT
        for base in node.bases:
            if isinstance(base, ast.Name):
                if base.id in self.class_metrics:
                    self.current_metrics['dit'] = max(self.current_metrics['dit'], self.class_metrics[base.id]['dit'] + 1)

        self.generic_visit(node)
        self.save_class_metrics()
        self.current_class = None

    def visit_Import(self, node):
        if self.current_class:
            for alias in node.names:
                self.current_metrics['dependencies'].add(alias.name)

    def visit_ImportFrom(self, node):
        if self.current_class:
            module = node.module
            for alias in node.names:
                dependency = f"{module}.{alias.name}" if module else alias.name
                self.current_metrics['dependencies'].add(dependency)

    def visit_Attribute(self, node):
        if self.current_class:
            if isinstance(node.value, ast.Name):
                self.current_metrics['dependencies'].add(node.value.id)
        self.generic_visit(node)

    def visit_Name(self, node):
        if self.current_class:
            if isinstance(node.ctx, ast.Load):
                self.current_metrics['nosi'] += 1
        self.generic_visit(node)

    def visit_FunctionDef(self, node):
        if self.current_class:
            self.current_metrics['methods'].add(node.name)
            self.current_metrics['wmc'] += 1  # Increment WMC for each method
        self.generic_visit(node)

    def visit_Assign(self, node):
        if self.current_class:
            for target in node.targets:
                if isinstance(target, ast.Name):
                    self.current_metrics['fields'].add(target.id)
                    self.current_metrics['assignments_qty'] += 1
                    self.current_metrics['variables_qty'] += 1
        self.generic_visit(node)

    def visit_Return(self, node):
        if self.current_class:
            self.current_metrics['return_qty'] += 1
        self.generic_visit(node)

    def visit_For(self, node):
        if self.current_class:
            self.current_metrics['loop_qty'] += 1
            self.current_depth += 1
            if self.current_depth > self.current_metrics['maxNestedBlocks']:
                self.current_metrics['maxNestedBlocks'] = self.current_depth
        self.generic_visit(node)
        self.current_depth -= 1

    def visit_While(self, node):
        if self.current_class:
            self.current_metrics['loop_qty'] += 1
            self.current_depth += 1
            if self.current_depth > self.current_metrics['maxNestedBlocks']:
                self.current_metrics['maxNestedBlocks'] = self.current_depth
        self.generic_visit(node)
        self.current_depth -= 1

    def visit_If(self, node):
        if self.current_class:
            if isinstance(node.test, ast.Compare):
                self.current_metrics['comparisons_qty'] += 1
            self.current_depth += 1
            if self.current_depth > self.current_metrics['maxNestedBlocks']:
                self.current_metrics['maxNestedBlocks'] = self.current_depth
        self.generic_visit(node)
        self.current_depth -= 1

    def visit_Try(self, node):
        if self.current_class:
            self.current_metrics['try_catch_qty'] += 1
            self.current_depth += 1
            if self.current_depth > self.current_metrics['maxNestedBlocks']:
                self.current_metrics['maxNestedBlocks'] = self.current_depth
        self.generic_visit(node)
        self.current_depth -= 1

    def visit_ExceptHandler(self, node):
        if self.current_class:
            self.current_metrics['try_catch_qty'] += 1
            self.current_depth += 1
            if self.current_depth > self.current_metrics['maxNestedBlocks']:
                self.current_metrics['maxNestedBlocks'] = self.current_depth
        self.generic_visit(node)
        self.current_depth -= 1

    def visit_BinOp(self, node):
        if isinstance(node.op, (ast.Add, ast.Sub, ast.Mult, ast.Div, ast.Mod, ast.Pow, ast.LShift, ast.RShift)):
            if self.current_class:
                self.current_metrics['math_operations_qty'] += 1
        self.generic_visit(node)

    def visit_Constant(self, node):
        if isinstance(node.value, str):
            if self.current_class:
                self.current_metrics['string_literals_qty'] += 1
                # Extract unique words from the string literals
                words = self.words_pattern.findall(node.value)
                self.unique_words.update(words)
        elif isinstance(node.value, (int, float)):
            if self.current_class:
                self.current_metrics['numbers_qty'] += 1
        self.generic_visit(node)

    def visit_Expr(self, node):
        if self.current_class and isinstance(node.value, (ast.BinOp, ast.Call, ast.Subscript, ast.Name)):
            self.current_metrics['parenthesized_exps_qty'] += 1
        self.generic_visit(node)

    def save_class_metrics(self):
        if self.current_class:
            self.current_metrics['uniqueWordsQty'] = len(self.unique_words)
            self.class_metrics[self.current_class] = self.current_metrics.copy()
            # Reset for the next class
            self.unique_words = set()

    def calculate_cbo(self):
        # Calculate CBO by counting unique dependencies for each class
        cbo_metrics = {cls: len(metrics['dependencies']) for cls, metrics in self.class_metrics.items()}
        return cbo_metrics

    def calculate_wmc(self):
        # Return the stored WMC values for each class
        return {cls: metrics['wmc'] for cls, metrics in self.class_metrics.items()}

    def calculate_dit(self):
        # Return the stored DIT values for each class
        return {cls: metrics['dit'] for cls, metrics in self.class_metrics.items()}

    def calculate_rfc(self):
        # Calculate RFC by counting unique method calls
        rfc_metrics = {cls: len(metrics['methods']) for cls, metrics in self.class_metrics.items()}
        return rfc_metrics

    def calculate_lcom(self):
        # LCOM Calculation
        lcom_metrics = {}

        for cls, metrics in self.class_metrics.items():
            methods = metrics['methods']
            fields = metrics['fields']

            # A dictionary to store which fields are used by each method
            method_field_usage = {method: set() for method in methods}

            # Populate the method_field_usage with fields used by each method
            for field in fields:
                for method in methods:
                    if field in method:  # Replace this with actual logic to check field usage by method
                        method_field_usage[method].add(field)

            # Calculate the number of method pairs that do not share fields
            pairs_with_no_shared_fields = 0
            method_list = list(methods)

            for i in range(len(method_list)):
                for j in range(i + 1, len(method_list)):
                    m1 = method_list[i]
                    m2 = method_list[j]
                    if method_field_usage[m1].isdisjoint(method_field_usage[m2]):
                        pairs_with_no_shared_fields += 1

            # LCOM value is the number of method pairs with no shared fields
            lcom_metrics[cls] = pairs_with_no_shared_fields

        return lcom_metrics

    def calculate_max_nested_blocks(self):
        # Return the stored max nested blocks values for each class
        return {cls: metrics['maxNestedBlocks'] for cls, metrics in self.class_metrics.items()}

    def calculate_unique_words_qty(self):
        # Return the stored unique words quantity for each class
        return {cls: metrics['uniqueWordsQty'] for cls, metrics in self.class_metrics.items()}


def analyze_metrics_in_directory(directory='.'):
    print(f"\nAnalyzing Python files in directory: {directory}\n")
    calculator = MetricsCalculator()

    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith('.py'):
                file_path = os.path.join(root, file)
                with open(file_path, 'r', encoding='utf-8') as f:
                    try:
                        tree = ast.parse(f.read(), filename=file_path)
                        calculator.visit(tree)
                    except SyntaxError as e:
                        print(f"Syntax error in {file_path}: {e}")

    cbo_metrics = calculator.calculate_cbo()
    wmc_metrics = calculator.calculate_wmc()
    dit_metrics = calculator.calculate_dit()
    rfc_metrics = calculator.calculate_rfc()
    lcom_metrics = calculator.calculate_lcom()
    max_nested_blocks = calculator.calculate_max_nested_blocks()
    unique_words_qty = calculator.calculate_unique_words_qty()

    data = []
    for cls, metrics in calculator.class_metrics.items():
        data.append({
            'Class': cls,
            'CBO': cbo_metrics.get(cls, 0),
            'WMC': wmc_metrics.get(cls, 0),
            'DIT': dit_metrics.get(cls, 0),
            'RFC': rfc_metrics.get(cls, 0),
            'LCOM': lcom_metrics.get(cls, 0),
            'Return Quantity': metrics['return_qty'],
            'Loop Quantity': metrics['loop_qty'],
            'Comparisons Quantity': metrics['comparisons_qty'],
            'Try/Catch Quantity': metrics['try_catch_qty'],
            'Parenthesized Expressions Quantity': metrics['parenthesized_exps_qty'],
            'String Literals Quantity': metrics['string_literals_qty'],
            'Numbers Quantity': metrics['numbers_qty'],
            'Assignments Quantity': metrics['assignments_qty'],
            'Math Operations Quantity': metrics['math_operations_qty'],
            'Variables Quantity': metrics['variables_qty'],
            'Max Nested Blocks': metrics['maxNestedBlocks'],
            'Unique Words Quantity': metrics['uniqueWordsQty']
        })

    df = pd.DataFrame(data)
    df.to_csv('class_metrics.csv', index=False)
    print("Metrics saved to 'class_metrics.csv'.")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        git_url = sys.argv[1]
        clone_dir = sys.argv[2] if len(sys.argv) > 2 else 'temp_repo'
    else:
        print("Please provide the Git repository URL as the first argument.")
        sys.exit(1)

    # Step 1: Clone the repository
    clone_repo(git_url, clone_dir)

    # Step 2: Run cloc and the analyzer on the cloned directory
    run_cloc(clone_dir)
    analyze_metrics_in_directory(clone_dir)

    # Step 3: Delete the cloned directory
    delete_directory(clone_dir)