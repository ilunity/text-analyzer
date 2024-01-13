import signal
import sys


class SigtermHandler:
    should_exit = False
    text_processing = False

    def __init__(self):
        signal.signal(signal.SIGTERM, self.handle_sigterm)

    def handle_sigterm(self, signum, frame):
        if not self.text_processing:
            sys.exit(0)

        self.should_exit = True

    def start_text_processing(self):
        self.text_processing = True

    def finish_text_processing(self):
        if self.should_exit:
            sys.exit(0)

        self.text_processing = False
