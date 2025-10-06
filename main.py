from fastapi import FastAPI, HTTPException, File, UploadFile, Form
import docker
import os
import logging

app = FastAPI()

# Инициализация клиента Docker
client = docker.from_env()

# Папка для сохранения Docker-образов
IMAGES_DIR = "images"
os.makedirs(IMAGES_DIR, exist_ok=True)

# Инициализация логгера
logging.basicConfig(level=logging.DEBUG)


@app.post("/create_docker_image/")
async def create_docker_image(
    project_files: UploadFile = File(...),
    tech_stack: str = Form("python:3.8"),  # Используем Form для получения значений
    user_requirements: UploadFile = File(None),  # Новый параметр для загрузки требований
    executable_file: str = Form("app.py")  # Используем Form для получения имени исполняемого файла
):
    try:
        logging.debug(f"Received tech_stack: {tech_stack}")
        logging.debug(f"Received executable_file: {executable_file}")  # Для отладки
        logging.debug("Получен запрос на создание Docker-образа")

        # Проверяем, что файл был передан
        if not project_files.filename:
            raise HTTPException(status_code=400, detail="No file uploaded")

        logging.debug(f"Файл {project_files.filename} загружен")

        # Сохраняем файл проекта в папку 'projects'
        os.makedirs("projects", exist_ok=True)
        project_path = os.path.join("projects", project_files.filename)

        # Сохраняем содержимое файла
        with open(project_path, "wb") as f:
            f.write(await project_files.read())

        logging.debug(f"Файл сохранён: {project_path}")

        # Генерация Dockerfile, сохраняем его в корень проекта
        dockerfile_content = f"""
        FROM {tech_stack}
        WORKDIR /app
        COPY projects/requirements.txt /app/requirements.txt
        RUN pip install -r /app/requirements.txt
        COPY projects/ /app/projects/
        CMD ["python", "/app/projects/{executable_file}"]
        """

        # Проверяем, загрузил ли пользователь свой requirements.txt
        if user_requirements:
            requirements_path = os.path.join("projects", "requirements.txt")
            with open(requirements_path, "wb") as f:
                f.write(await user_requirements.read())
            logging.debug(f"requirements.txt сохранён по пути {requirements_path}")
        else:
            logging.debug("requirements.txt не был предоставлен пользователем.")

        # Путь к Dockerfile
        dockerfile_path = os.path.join(os.getcwd(), "Dockerfile")
        with open(dockerfile_path, "w") as f:
            f.write(dockerfile_content)

        logging.debug(f"Dockerfile сохранён по пути {dockerfile_path}")

        # Строим Docker-образ, используя созданный Dockerfile
        logging.debug(f"Запуск сборки Docker-образа...")
        image, logs = client.images.build(path=".", dockerfile="Dockerfile", tag="my_image")

        logging.debug(f"Образ создан: {image.tags}")

        # Сохраняем Docker-образ в файл .tar в папку images
        image_name = "my_image_latest.tar"
        image_path = os.path.join(IMAGES_DIR, image_name)
        
        logging.debug(f"Сохраняем образ в {image_path}")
        os.system(f"docker save -o {image_path} my_image")

        logging.debug(f"Образ сохранён в {image_path}")

        # Возвращаем информацию о созданном образе
        return {
            "message": "Docker image created and saved",
            "image": image.tags,
            "image_path": image_path
        }

    except Exception as e:
        logging.error(f"Ошибка: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
