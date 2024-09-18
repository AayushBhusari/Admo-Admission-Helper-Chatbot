import tkinter as tk
from tkinter import font as tkfont
from tkinter import ttk

# Mock data for colleges with additional contact information
college_data = {
    "GHRCE": {
        'Branches': ['Computer Science', 'Electronics & Telecommunication', 'Mechanical Engineering', 'Civil Engineering'],
        'Fee Structure': '₹1,00,000 per year',
        'Placement Details': {
            'Recruiters': ['TCS', 'Infosys', 'Wipro'],
            'Details': 'Average Salary: ₹4,00,000 per annum.'
        },
        'Cutoff': {
            'Computer Science': '95%',
            'Electronics & Telecommunication': '90%',
            'Mechanical Engineering': '85%',
            'Civil Engineering': '80%'
        },
        'Competitive Exams': ['JEE Main', 'MHT-CET'],
        'Ratings': {
            'Infrastructure': 4,
            'Placement': 4,
            'Hostel Facilities': 3
        },
        'Contact Info': {
            'Email': 'info@ghrce.edu.in',
            'Website': 'https://ghrce.edu.in',
            'Contact No': '+91-712-1234567'
        }
    },
    "RCOEM": {
        'Branches': ['Computer Science', 'Civil Engineering', 'Electrical Engineering', 'Mechanical Engineering'],
        'Fee Structure': '₹90,000 per year',
        'Placement Details': {
            'Recruiters': ['IBM', 'Cognizant', 'Accenture'],
            'Details': 'Average Salary: ₹3,50,000 per annum.'
        },
        'Cutoff': {
            'Computer Science': '92%',
            'Civil Engineering': '87%',
            'Electrical Engineering': '85%',
            'Mechanical Engineering': '83%'
        },
        'Competitive Exams': ['JEE Main', 'MHT-CET'],
        'Ratings': {
            'Infrastructure': 3,
            'Placement': 3,
            'Hostel Facilities': 2
        },
        'Contact Info': {
            'Email': 'admissions@rcoem.in',
            'Website': 'https://rcoem.in',
            'Contact No': '+91-712-9876543'
        }
    },
    "YCCE": {
        'Branches': ['Computer Science', 'Information Technology', 'Electrical Engineering', 'Mechanical Engineering'],
        'Fee Structure': '₹85,000 per year',
        'Placement Details': {
            'Recruiters': ['HCL', 'Capgemini', 'Tech Mahindra'],
            'Details': 'Average Salary: ₹3,80,000 per annum.'
        },
        'Cutoff': {
            'Computer Science': '90%',
            'Information Technology': '88%',
            'Electrical Engineering': '85%',
            'Mechanical Engineering': '82%'
        },
        'Competitive Exams': ['JEE Main', 'MHT-CET'],
        'Ratings': {
            'Infrastructure': 4,
            'Placement': 3,
            'Hostel Facilities': 4
        },
        'Contact Info': {
            'Email': 'info@ycce.edu',
            'Website': 'https://ycce.edu',
            'Contact No': '+91-712-8765432'
        }
    },
    "VNIT": {
        'Branches': ['Civil Engineering', 'Computer Science', 'Electrical Engineering', 'Mechanical Engineering'],
        'Fee Structure': '₹1,20,000 per year',
        'Placement Details': {
            'Recruiters': ['Microsoft', 'Google', 'Amazon'],
            'Details': 'Average Salary: ₹6,00,000 per annum.'
        },
        'Cutoff': {
            'Civil Engineering': '93%',
            'Computer Science': '98%',
            'Electrical Engineering': '95%',
            'Mechanical Engineering': '92%'
        },
        'Competitive Exams': ['JEE Main', 'JEE Advanced'],
        'Ratings': {
            'Infrastructure': 5,
            'Placement': 5,
            'Hostel Facilities': 4
        },
        'Contact Info': {
            'Email': 'admission@vnit.ac.in',
            'Website': 'https://vnit.ac.in',
            'Contact No': '+91-712-2345678'
        }
    },
    "IIIT": {
        'Branches': ['Computer Science', 'Electronics'],
        'Fee Structure': '₹1,50,000 per year',
        'Placement Details': {
            'Recruiters': ['Qualcomm', 'Oracle', 'Intel'],
            'Details': 'Average Salary: ₹7,00,000 per annum.'
        },
        'Cutoff': {
            'Computer Science': '97%',
            'Electronics': '94%'
        },
        'Competitive Exams': ['JEE Main', 'JEE Advanced'],
        'Ratings': {
            'Infrastructure': 5,
            'Placement': 4,
            'Hostel Facilities': 3
        },
        'Contact Info': {
            'Email': 'info@iiit.ac.in',
            'Website': 'https://iiit.ac.in',
            'Contact No': '+91-712-3456789'
        }
    }
}

def get_college_info(college):
    details = college_data.get(college)
    if not details:
        return "I'm sorry, I couldn't fetch the data for that college."

    response = f"Here is the information for {college}:\n"
    response += "Branches Offered:\n"
    for branch in details['Branches']:
        response += f"  - {branch}\n"
    response += f"Fee Structure: {details['Fee Structure']}\n"
    response += "Placement Details:\n"
    response += f"  - Details: {details['Placement Details']['Details']}\n"
    response += f"  - Recruiters: {', '.join(details['Placement Details']['Recruiters'])}\n"
    response += "Cutoff Percentages:\n"
    for branch, cutoff in details['Cutoff'].items():
        response += f"  - {branch}: {cutoff}\n"
    response += "Competitive Exams Required:\n"
    for exam in details['Competitive Exams']:
        response += f"  - {exam}\n"
    
    # Add ratings to the response
    response += "Ratings:\n"
    for category, rating in details['Ratings'].items():
        stars = '★' * rating + '☆' * (5 - rating)  # Create star representation
        response += f"  - {category}: {stars}\n"
    
    # Add contact info to the response
    response += "Contact Information:\n"
    response += f"  - Email: {details['Contact Info']['Email']}\n"
    response += f"  - Website: {details['Contact Info']['Website']}\n"
    response += f"  - Contact No: {details['Contact Info']['Contact No']}\n"

    return response

def update_response(event=None):
    college = college_var.get()
    response = get_college_info(college)
    chat_log.config(state=tk.NORMAL)
    chat_log.insert(tk.END, "\n\n" + response)  # Preserve existing chat
    chat_log.config(state=tk.DISABLED)

# Tkinter GUI Setup
root = tk.Tk()
root.title("Nagpur College Information Chatbot")
root.geometry("900x800")  # Larger dimension for better visibility
root.configure(bg="#f5f5f5")

# Font configurations
chat_font = tkfont.Font(family="Helvetica", size=12)
button_font = tkfont.Font(family="Helvetica", size=10, weight="bold")

# Create a chat log display with enhanced styles
chat_log = tk.Text(root, bg="white", width=100, height=30, font=chat_font, wrap=tk.WORD, padx=10, pady=10, borderwidth=2, relief="solid")
chat_log.grid(row=0, column=0, columnspan=2, padx=20, pady=20)
chat_log.config(state=tk.DISABLED)

# Create a dropdown for selecting colleges
college_var = tk.StringVar(value="Select a College")
college_dropdown = ttk.Combobox(root, textvariable=college_var, values=list(college_data.keys()), font=chat_font, state="readonly", width=70)
college_dropdown.grid(row=1, column=0, padx=20, pady=10)
college_dropdown.bind("<<ComboboxSelected>>", update_response)

# Create a button to get information
fetch_button = tk.Button(root, text="Get Information", command=update_response, bg="#4CAF50", fg="white", font=button_font, width=20)
fetch_button.grid(row=1, column=1, padx=20, pady=10)

# Start the Tkinter main event loop
root.mainloop()
