from base.models import Note
from .serializers import NoteSerializer

from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated


@api_view(['GET'])
def getRoutes(request):    
    routes = [
        '/api/token',
        '/api/token/refresh',
        '/api/notes/'
    ]
    
    return Response(routes)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getNotes(request):
    user = request.user
    notes = user.note_set.all()
    # queryset=Note.objects.all()
    serializer = NoteSerializer(notes, many=True)
    return Response(serializer.data)