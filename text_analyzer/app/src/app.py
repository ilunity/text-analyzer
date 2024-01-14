import json

import pika
from preprocessing import Pipeline
from rabbit_connection import RabbitMQConnection

pipeline = Pipeline()

def publishTagsAndId(user_id, tags: dict):
    message = json.dumps(tags)

    properties = pika.BasicProperties(
        headers={'id': user_id}
    )

    channel.basic_publish(
        exchange='',
        routing_key='tdf_result',
        body=message,
        properties=properties
    )
    print(" [x] Sent tags for user {}.".format(user_id))


def callback(ch, method, properties, body):
    file_id = properties.headers.get('id')

    if file_id is not None:
        print(f"Received file with id {file_id} ")
    else:
        print("Received file with missing or incomplete header information")
        return

    text = body
    pipeline.set_text(text)
    pipeline.process()
    processed_tags = pipeline.get_tags()
    publishTagsAndId(file_id, processed_tags)


rabbit_connection = RabbitMQConnection()
rabbit_connection.connect()
channel = rabbit_connection.get_channel()

channel.basic_consume(queue='file_queue', on_message_callback=callback, auto_ack=True)

print(' [*] Waiting for messages. To exit press CTRL+C')
channel.start_consuming()
