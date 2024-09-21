from django.http.response import HttpResponseRedirect
from django.views.decorators.cache import never_cache
from django.views.generic import TemplateView


def handler404(request, *args, **kwargs):
    return HttpResponseRedirect('/')


index = never_cache(TemplateView.as_view(template_name='index.html'))
