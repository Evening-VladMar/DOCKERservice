
        FROM python:3.8
        WORKDIR /app
        COPY projects/requirements.txt /app/requirements.txt
        RUN pip install -r /app/requirements.txt
        COPY projects/ /app/projects/
        CMD ["python", "/app/projects/app.py"]
        




        