from multiprocessing import Process
import os

BASE_DIR = os.path.dirname(__file__)  # Folder where run.py is located

def run_app(file_name):
    os.system(f"python {os.path.join(BASE_DIR, file_name)}")

if __name__ == "__main__":
    Process(target=run_app, args=("medical_chatbot.py",)).start()
    Process(target=run_app, args=("medicine_identifier.py",)).start()
    Process(target=run_app, args=("prescription_analyzer.py",)).start()
    Process(target=run_app, args=("hospital_route_finder.py",)).start()
    Process(target=run_app, args=("personal.py",)).start()
