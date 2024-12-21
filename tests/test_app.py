import pytest
from app import app  # Assuming your Flask app is in the app.py file

@pytest.fixture
def client():
    with app.test_client() as client:
        yield client

def test_home(client):
    """Test the home page"""
    response = client.get('/')
    assert response.status_code == 200
    assert b'Welcome to the Car Store' in response.data

def test_login(client):
    """Test the login page"""
    response = client.get('/login')
    assert response.status_code == 200
    assert b'Login' in response.data
