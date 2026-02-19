# Python Backend

## Setup

1. Create a virtual environment:

```bash
python -m venv venv
```

2. Activate the virtual environment:

- Windows: `venv\Scripts\activate`
- Unix/MacOS: `source venv/bin/activate`

3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

5. Run the server:

```bash
python app.py
```

The Python backend will run on http://localhost:8000
