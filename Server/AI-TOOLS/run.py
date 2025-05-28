from multiprocessing import Process
import os

def run_app1():
    os.system("python medical_chatbot.py")

def run_app2():
    os.system("python medicine_identifier.py")

def run_app3():
    os.system("python prescription_analyzer.py")

def run_app4():
    os.system("python hospital_route_finder.py")

def run_app5():
    os.system("python personal.py")

if __name__ == "__main__":
    Process(target=run_app1).start()
    Process(target=run_app2).start()
    Process(target=run_app3).start()
    Process(target=run_app4).start()
    Process(target=run_app5).start()
