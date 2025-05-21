# Memorialyze

A personal memory archive system that allows users to upload multi-modal memories (video, audio, text) and query them through a conversational interface.

## Features

- Multi-modal memory upload (video, audio, text)
- Automatic transcription and embedding generation
- Conversational interface for memory retrieval
- Access control for shared memories
- Media playback integration

## Development Setup

### Prerequisites

- Python 3.9+
- Docker and Docker Compose
- An Anthropic API key

### Setup Instructions

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd memorialyze
   ```

2. Set up the Python environment
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. Create a .env file with your configuration
   ```bash
   cp .env.example .env
   # Edit .env with your settings, especially your Anthropic API key
   ```

4. Start the database and supporting services
   ```bash
   docker-compose up -d
   ```

5. Run the setup script
   ```bash
   python setup_dev.py
   ```

6. Start the development server
   ```bash
   uvicorn src.main:app --reload
   ```

7. Access the API documentation at http://localhost:8000/docs

## Project Structure

- `src/`: Main application code
  - `api/`: API routes and endpoints
  - `core/`: Core application components (config, database)
  - `models/`: SQLAlchemy database models
  - `schemas/`: Pydantic schemas for request/response validation
  - `services/`: Business logic services
  - `utils/`: Utility functions
- `frontend/`: Frontend application code
- `notebooks/`: Jupyter notebooks for prototyping
- `tests/`: Test suite

## License

[MIT](LICENSE)
