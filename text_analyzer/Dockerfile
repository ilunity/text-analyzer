FROM python:3.10 as requirements-stage

WORKDIR /tmp

RUN python -m pip install --upgrade pip --user

RUN pip install poetry

COPY ./pyproject.toml ./poetry.lock* /tmp/

RUN poetry export -f requirements.txt --output requirements.txt --without-hashes

FROM python:3.10

# Set the working directory in the container
WORKDIR /code

COPY --from=requirements-stage /tmp/requirements.txt /code/requirements.txt

RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

COPY ./app /code/app

RUN python app/src/download_model.py

# Expose the port the app runs on
EXPOSE 80

# Command to run the application
CMD ["python", "app/src/app.py"]