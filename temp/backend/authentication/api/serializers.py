from authentication.models import ProductRating,User,Product, Package,Order, PackageOrder, OrderProduct, PackageOrderProduct, ProductComment
from django.contrib.auth import authenticate
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"

class userSignupSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(
        style={"input_type": "password"}, write_only=True)

    class Meta:
        model = User
        fields = ["fullname", "email", "password", "password2"]
        extra_kwargs = {
            "password": {"write_only": True},
        }

    def save(self, **kwargs):
        user = User(
            fullname=self.validated_data["fullname"],
            email=self.validated_data["email"],
        )
        password = self.validated_data["password"]
        password2 = self.validated_data["password2"]
        if password != password2:
            raise serializers.ValidationError(
                {"error": "Password do not match"})
        user.set_password(password)
        user.save()
        return user


class LoginSerializer(serializers.Serializer):

    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Incorrect Credentials")



class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'price', 'description', 'image','rating','product_type']

class OrderProductSerializer(serializers.ModelSerializer):
    product = ProductSerializer()
    class Meta:
        model = OrderProduct
        fields = ['id', 'product', 'quantity']

class PackageOrderProductSerializer(serializers.ModelSerializer):
    product = ProductSerializer()

    class Meta:
        model = PackageOrderProduct
        fields = ['id', 'product', 'quantity']

class PackageSerializer(serializers.ModelSerializer):
    products = ProductSerializer(many=True, read_only=True)

    class Meta:
        model = Package
        fields = ['id', 'name', 'products','image','description']

class PackageCreateSerializer(serializers.ModelSerializer):
    products = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all(), many=True)

    class Meta:
        model = Package
        fields = ['id', 'name', 'products', 'image', 'description']

    def create(self, validated_data):
        products_data = validated_data.pop('products')
        package = Package.objects.create(**validated_data)
        for product in products_data:
            package.products.add(product)
        return package

class OrderSerializer(serializers.ModelSerializer):
    order_products = OrderProductSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'user', 'name', 'address', 'phone', 'bill', 'payment_id', 'total_price', 'created_at','order_products','delivery_user','status','cod']

class PackageOrderSerializer(serializers.ModelSerializer):
    package_order_products = PackageOrderProductSerializer(many=True, read_only=True)
    package = PackageSerializer()

    class Meta:
        model = PackageOrder
        fields = ['id', 'user', 'name', 'address', 'phone', 'bill', 'payment_id', 'total_price', 'created_at', 'package', 'package_order_products','delivery_user','status','cod']


class ProductCommentSerializer(serializers.ModelSerializer):
    user=UserSerializer()
    class Meta:
        model = ProductComment
        fields = ['id', 'product', 'user', 'comment', 'created_at']
        
class ProductRatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductRating
        fields = ['id', 'product', 'user', 'rating', 'created_at']