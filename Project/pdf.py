# pdf_generator.py
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch, cm
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Image, 
    PageBreak, Table, TableStyle
)
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
from reportlab.lib import colors
from datetime import datetime
import os

class PDFGenerator:
    def __init__(self, output_filename="Tech_Career_Navigator.pdf"):
        self.filename = output_filename
        self.doc = SimpleDocTemplate(
            output_filename, 
            pagesize=A4,
            rightMargin=0.75*inch,
            leftMargin=0.75*inch,
            topMargin=0.75*inch,
            bottomMargin=0.75*inch
        )
        self.story = []
        self.styles = self._create_styles()
    
    def _create_styles(self):
        """Create custom paragraph styles"""
        styles = getSampleStyleSheet()
        
        # Title Style
        styles.add(ParagraphStyle(
            name='CustomTitle',
            parent=styles['Heading1'],
            fontSize=28,
            textColor=colors.HexColor('#1F4788'),
            spaceAfter=30,
            alignment=TA_CENTER,
            fontName='Helvetica-Bold'
        ))
        
        # Subtitle Style
        styles.add(ParagraphStyle(
            name='CustomSubtitle',
            parent=styles['Heading2'],
            fontSize=18,
            textColor=colors.HexColor('#2E5C8A'),
            spaceAfter=20,
            alignment=TA_CENTER,
            fontName='Helvetica-Bold'
        ))
        
        # Heading Style
        styles.add(ParagraphStyle(
            name='CustomHeading',
            parent=styles['Heading2'],
            fontSize=14,
            textColor=colors.HexColor('#1F4788'),
            spaceAfter=15,
            spaceBefore=10,
            fontName='Helvetica-Bold'
        ))
        
        # Body Style
        styles.add(ParagraphStyle(
            name='CustomBody',
            parent=styles['BodyText'],
            fontSize=11,
            alignment=TA_JUSTIFY,
            spaceAfter=12,
            leading=16,
            fontName='Helvetica'
        ))
        
        # Info Label Style
        styles.add(ParagraphStyle(
            name='InfoLabel',
            parent=styles['Normal'],
            fontSize=12,
            textColor=colors.HexColor('#1F4788'),
            fontName='Helvetica-Bold',
            spaceAfter=5
        ))
        
        # Info Value Style
        styles.add(ParagraphStyle(
            name='InfoValue',
            parent=styles['Normal'],
            fontSize=11,
            textColor=colors.black,
            fontName='Helvetica',
            spaceAfter=15
        ))
        
        return styles
    
    def add_page1_student_details(self, name, class_info, college, project_name):
        """Add Page 1: Student Details"""
        # Title
        self.story.append(Paragraph(project_name, self.styles['CustomTitle']))
        self.story.append(Spacer(1, 0.3*inch))
        
        # Subtitle
        self.story.append(Paragraph("Project Documentation", self.styles['CustomSubtitle']))
        self.story.append(Spacer(1, 0.5*inch))
        
        # Student Information Table
        student_data = [
            ['<b>Student Name:</b>', name],
            ['<b>Class:</b>', class_info],
            ['<b>College:</b>', college],
            ['<b>Document Generated:</b>', datetime.now().strftime('%d %B %Y')]
        ]
        
        student_table = Table(student_data, colWidths=[2*inch, 3.5*inch])
        student_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#E8F0F8')),
            ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 11),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
            ('TOPPADDING', (0, 0), (-1, -1), 12),
            ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#1F4788')),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#F5F9FC')])
        ]))
        
        self.story.append(student_table)
        self.story.append(Spacer(1, 1*inch))
        
        # Footer text
        footer_text = """
        <font size=10>
        This document contains the complete project documentation for <b>Tech Career Navigator</b>,
        a backend web application designed to provide structured IT career guidance to students.
        <br/><br/>
        <i>All information is confidential and for educational purposes only.</i>
        </font>
        """
        self.story.append(Paragraph(footer_text, self.styles['CustomBody']))
        self.story.append(PageBreak())
    
    def add_page2_lean_canvas(self, image_path):
        """Add Page 2: Lean Canvas Image"""
        self.story.append(Paragraph("Lean Canvas", self.styles['CustomTitle']))
        self.story.append(Spacer(1, 0.3*inch))
        
        if os.path.exists(image_path):
            try:
                img = Image(image_path, width=7*inch, height=9*inch)
                img.hAlign = 'CENTER'
                self.story.append(img)
            except Exception as e:
                self.story.append(Paragraph(
                    f'<font color="red"><b>Error loading Lean Canvas image:</b> {str(e)}</font>',
                    self.styles['CustomBody']
                ))
        else:
            self.story.append(Paragraph(
                f'<font color="red"><b>Image not found:</b> {image_path}</font>',
                self.styles['CustomBody']
            ))
        
        self.story.append(PageBreak())
    
    def add_page3_concept_notes(self):
        """Add Page 3: Concept Notes"""
        self.story.append(Paragraph("Concept Notes", self.styles['CustomTitle']))
        self.story.append(Spacer(1, 0.3*inch))
        
        # Problem Statement
        self.story.append(Paragraph("Problem Statement", self.styles['CustomHeading']))
        problem_text = """
        The following issues are common among students pursuing technology courses:
        <ul>
        <li>Very few colleges provide structured IT career guidance within the curriculum.</li>
        <li>Students often cannot tell which of their subjects are actually relevant to industry roles.</li>
        <li>There is no clear starting point when it comes to building skills for a specific career.</li>
        <li>The absence of structured learning plans makes it easy to lose motivation over time.</li>
        <li>Students often prepare for the wrong things and realize it only at the placement stage.</li>
        </ul>
        """
        self.story.append(Paragraph(problem_text, self.styles['CustomBody']))
        self.story.append(Spacer(1, 0.2*inch))
        
        # Solution
        self.story.append(Paragraph("Solution", self.styles['CustomHeading']))
        solution_text = """
        <b>Tech Career Navigator</b> is a backend web application built to address this problem directly. 
        It takes basic student information, such as the course they are enrolled in, their current semester, 
        and the subjects they are studying, and uses that to recommend a career direction along with a 
        structured roadmap. It also breaks that roadmap down into daily tasks so students have something 
        concrete to work on every day.
        """
        self.story.append(Paragraph(solution_text, self.styles['CustomBody']))
        self.story.append(Spacer(1, 0.2*inch))
        
        # Project Objectives
        self.story.append(Paragraph("Project Objectives", self.styles['CustomHeading']))
        objectives_text = """
        The core goals of the Tech Career Navigator system are:
        <ol>
        <li>Help students identify a suitable career path based on their academic background.</li>
        <li>Highlight which subjects within their current course are most relevant to IT roles.</li>
        <li>Generate a step-by-step career roadmap tailored to the chosen field.</li>
        <li>Break the roadmap into daily learning tasks to encourage consistent progress.</li>
        <li>Track task completion so students can monitor their own progress over time.</li>
        </ol>
        """
        self.story.append(Paragraph(objectives_text, self.styles['CustomBody']))
        
        self.story.append(PageBreak())
    
    def add_screenshot_page(self, image_path, caption=""):
        """Add a screenshot page"""
        if os.path.exists(image_path):
            try:
                # Get image dimensions to maintain aspect ratio
                img = Image(image_path, width=6.5*inch, height=5*inch)
                img.hAlign = 'CENTER'
                
                self.story.append(Spacer(1, 0.3*inch))
                self.story.append(img)
                
                if caption:
                    self.story.append(Spacer(1, 0.2*inch))
                    caption_text = f'<font size=10><i>{caption}</i></font>'
                    self.story.append(Paragraph(caption_text, self.styles['CustomBody']))
                
                self.story.append(Spacer(1, 0.3*inch))
            except Exception as e:
                error_msg = f'<font color="red">Error loading image: {str(e)}</font>'
                self.story.append(Paragraph(error_msg, self.styles['CustomBody']))
        else:
            error_msg = f'<font color="red"><b>Image not found:</b> {image_path}</font>'
            self.story.append(Paragraph(error_msg, self.styles['CustomBody']))
    
    def add_screenshots_section(self, screenshots_list):
        """Add Screenshots Section (Page 4 onwards)
        
        Args:
            screenshots_list: List of tuples [(image_path, caption), ...]
        """
        self.story.append(Paragraph("Project Screenshots", self.styles['CustomTitle']))
        self.story.append(Spacer(1, 0.3*inch))
        
        for idx, (image_path, caption) in enumerate(screenshots_list, 1):
            self.story.append(Paragraph(f"Screenshot {idx}: {caption}", self.styles['CustomHeading']))
            self.add_screenshot_page(image_path, caption)
            
            # Add page break after each screenshot (except the last one)
            if idx < len(screenshots_list):
                self.story.append(PageBreak())
    
    def build(self):
        """Generate the PDF"""
        try:
            self.doc.build(self.story)
            print(f"✓ PDF generated successfully: {self.filename}")
            return True
        except Exception as e:
            print(f"✗ Error generating PDF: {str(e)}")
            return False


# Main Usage
if __name__ == "__main__":
    # Initialize PDF Generator
    pdf = PDFGenerator("Tech_Career_Navigator_Documentation.pdf")
    
    # Page 1: Student Details
    pdf.add_page1_student_details(
        name="Saurav Kumar",
        class_info="BCA 3rd Year",
        college="Maharaja Ranjit Singh College, Indore",
        project_name="Tech Career Navigator"
    )
    
    # Page 2: Lean Canvas
    pdf.add_page2_lean_canvas(image_path="./images/lean_canvas.png")
    
    # Page 3: Concept Notes
    pdf.add_page3_concept_notes()
    
    # Pages 4+: Screenshots
    # Update these paths with your actual image paths
    screenshots = [
        ("./images/screenshot_1_homepage.png", "Home Page - Student Registration"),
        ("./images/screenshot_2_profile.png", "Student Profile Page"),
        ("./images/screenshot_3_subjects.png", "Subject Selection Page"),
        ("./images/screenshot_4_career.png", "Career Path Selection"),
        ("./images/screenshot_5_roadmap.png", "Career Roadmap Display"),
        ("./images/screenshot_6_tasks.png", "Daily Tasks Dashboard"),
        ("./images/screenshot_7_progress.png", "Progress Tracking Page"),
    ]
    
    pdf.add_screenshots_section(screenshots)
    
    # Generate PDF
    pdf.build()