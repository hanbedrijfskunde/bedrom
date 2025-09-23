/**
 * PDF Generator Service
 * Handles dynamic loading of jsPDF and PDF generation for assessment materials
 */

export class PDFGenerator {
    constructor() {
        this.jsPDF = null;
        this.isLoading = false;
        this.loadPromise = null;
    }

    /**
     * Dynamically load jsPDF library
     */
    async loadJsPDF() {
        if (this.jsPDF) return this.jsPDF;
        if (this.isLoading) return this.loadPromise;

        this.isLoading = true;
        this.loadPromise = new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
            script.onload = () => {
                this.jsPDF = window.jspdf.jsPDF;
                this.isLoading = false;
                resolve(this.jsPDF);
            };
            script.onerror = (error) => {
                this.isLoading = false;
                reject(new Error('Failed to load jsPDF library'));
            };
            document.head.appendChild(script);
        });

        return this.loadPromise;
    }

    /**
     * Generate preparation summary PDF
     */
    async generatePreparationSummary(userData) {
        try {
            await this.loadJsPDF();
            
            const doc = new this.jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            // Colors
            const primaryColor = [59, 130, 246]; // Blue
            const textColor = [31, 41, 55]; // Gray-800
            const lightGray = [156, 163, 175]; // Gray-400

            // Header
            this.addHeader(doc, userData);
            
            // Role Information
            this.addRoleSection(doc, userData, 45);
            
            // Progress Overview
            this.addProgressSection(doc, userData, 85);
            
            // Preparation Checklist
            this.addChecklistSection(doc, userData, 130);
            
            // Team Information (if applicable)
            if (userData.team) {
                this.addTeamSection(doc, userData, 200);
            }
            
            // Footer
            this.addFooter(doc);
            
            // Save PDF
            const fileName = `strategische-arena-${userData.user?.name?.toLowerCase().replace(/\s+/g, '-') || 'voorbereiding'}.pdf`;
            doc.save(fileName);
            
            return { success: true, fileName };
        } catch (error) {
            console.error('PDF generation failed:', error);
            throw error;
        }
    }

    /**
     * Add header to PDF
     */
    addHeader(doc, userData) {
        // Title
        doc.setFontSize(24);
        doc.setTextColor(59, 130, 246);
        doc.text('De Strategische Arena', 105, 20, { align: 'center' });
        
        // Subtitle
        doc.setFontSize(14);
        doc.setTextColor(100, 116, 139);
        doc.text('Voorbereidingsoverzicht', 105, 30, { align: 'center' });
        
        // Date
        doc.setFontSize(10);
        const date = new Date().toLocaleDateString('nl-NL', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        doc.text(`Gegenereerd op: ${date}`, 105, 38, { align: 'center' });
    }

    /**
     * Add role information section
     */
    addRoleSection(doc, userData, yPos) {
        const role = userData.user?.role;
        if (!role) return yPos;
        
        // Section title
        doc.setFontSize(16);
        doc.setTextColor(31, 41, 55);
        doc.text('Geselecteerde Rol', 20, yPos);
        
        // Role box
        yPos += 10;
        doc.setFillColor(243, 244, 246);
        doc.roundedRect(20, yPos, 170, 25, 3, 3, 'F');
        
        // Role name
        doc.setFontSize(14);
        doc.setTextColor(31, 41, 55);
        doc.text(this.getRoleName(role), 30, yPos + 8);
        
        // Role description
        doc.setFontSize(10);
        doc.setTextColor(100, 116, 139);
        const description = this.getRoleDescription(role);
        const lines = doc.splitTextToSize(description, 150);
        doc.text(lines, 30, yPos + 15);
        
        return yPos + 30;
    }

    /**
     * Add progress section
     */
    addProgressSection(doc, userData, yPos) {
        const progress = userData.progress || {};
        
        // Section title
        doc.setFontSize(16);
        doc.setTextColor(31, 41, 55);
        doc.text('Voortgang', 20, yPos);
        
        yPos += 10;
        
        // Overall progress
        const overallProgress = this.calculateOverallProgress(progress);
        
        // Progress bar background
        doc.setFillColor(229, 231, 235);
        doc.roundedRect(20, yPos, 170, 8, 2, 2, 'F');
        
        // Progress bar fill
        const fillColor = overallProgress >= 80 ? [34, 197, 94] : // Green
                         overallProgress >= 50 ? [251, 146, 60] : // Orange
                         [239, 68, 68]; // Red
        doc.setFillColor(...fillColor);
        const fillWidth = (170 * overallProgress) / 100;
        if (fillWidth > 0) {
            doc.roundedRect(20, yPos, fillWidth, 8, 2, 2, 'F');
        }
        
        // Progress text
        doc.setFontSize(12);
        doc.setTextColor(31, 41, 55);
        doc.text(`${Math.round(overallProgress)}% Voltooid`, 105, yPos + 15, { align: 'center' });
        
        // Module breakdown
        yPos += 25;
        doc.setFontSize(10);
        
        const modules = progress.modules || {};
        Object.entries(modules).forEach(([module, completed], index) => {
            const icon = completed ? '✓' : '○';
            const color = completed ? [34, 197, 94] : [156, 163, 175];
            doc.setTextColor(...color);
            doc.text(`${icon} ${this.getModuleName(module)}`, 25, yPos + (index * 6));
        });
        
        return yPos + (Object.keys(modules).length * 6) + 10;
    }

    /**
     * Add checklist section
     */
    addChecklistSection(doc, userData, yPos) {
        // Section title
        doc.setFontSize(16);
        doc.setTextColor(31, 41, 55);
        doc.text('Voorbereiding Checklist', 20, yPos);
        
        yPos += 10;
        
        const checklist = [
            { item: 'Rol geselecteerd en begrepen', completed: !!userData.user?.role },
            { item: 'Bedrijfsinformatie doorgenomen', completed: userData.progress?.modules?.companyInfo },
            { item: 'Economische analyse voorbereid', completed: userData.progress?.modules?.economicAnalysis },
            { item: 'Marktstructuur bestudeerd', completed: userData.progress?.modules?.marketStructure },
            { item: 'ESG-factoren geanalyseerd', completed: userData.progress?.modules?.esgFactors },
            { item: 'Q&A geoefend', completed: userData.progress?.modules?.qaSimulator },
            { item: 'Team gevormd', completed: !!userData.team?.members?.length },
            { item: 'Presentatiemateriaal klaargezet', completed: userData.progress?.modules?.presentation }
        ];
        
        doc.setFontSize(10);
        checklist.forEach((item, index) => {
            const icon = item.completed ? '☑' : '☐';
            const color = item.completed ? [34, 197, 94] : [156, 163, 175];
            doc.setTextColor(...color);
            doc.text(`${icon} ${item.item}`, 25, yPos + (index * 7));
        });
        
        return yPos + (checklist.length * 7) + 10;
    }

    /**
     * Add team section
     */
    addTeamSection(doc, userData, yPos) {
        const team = userData.team;
        if (!team || !team.members) return yPos;
        
        // Check if we need a new page
        if (yPos > 240) {
            doc.addPage();
            yPos = 20;
        }
        
        // Section title
        doc.setFontSize(16);
        doc.setTextColor(31, 41, 55);
        doc.text('Team Informatie', 20, yPos);
        
        yPos += 10;
        
        // Team name
        doc.setFontSize(12);
        doc.text(`Team: ${team.name || 'Naamloos Team'}`, 25, yPos);
        
        yPos += 8;
        
        // Team members
        doc.setFontSize(10);
        doc.setTextColor(100, 116, 139);
        doc.text('Teamleden:', 25, yPos);
        
        yPos += 6;
        team.members.forEach((member, index) => {
            const roleText = member.role ? ` - ${this.getRoleName(member.role)}` : '';
            doc.text(`• ${member.name}${roleText}`, 30, yPos + (index * 6));
        });
        
        return yPos + (team.members.length * 6) + 10;
    }

    /**
     * Add footer to PDF
     */
    addFooter(doc) {
        const pageCount = doc.internal.getNumberOfPages();
        
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            
            // Page number
            doc.setFontSize(9);
            doc.setTextColor(156, 163, 175);
            doc.text(`Pagina ${i} van ${pageCount}`, 105, 285, { align: 'center' });
            
            // Confidentiality notice
            doc.setFontSize(8);
            doc.text('Vertrouwelijk - Alleen voor assessmentdoeleinden', 105, 290, { align: 'center' });
        }
    }

    /**
     * Generate role-specific materials PDF
     */
    async generateRoleMaterials(role, materials) {
        try {
            await this.loadJsPDF();
            
            const doc = new this.jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            // Title page
            doc.setFontSize(28);
            doc.setTextColor(59, 130, 246);
            doc.text('De Strategische Arena', 105, 50, { align: 'center' });
            
            doc.setFontSize(18);
            doc.setTextColor(100, 116, 139);
            doc.text('Rolspecifieke Materialen', 105, 65, { align: 'center' });
            
            doc.setFontSize(16);
            doc.setTextColor(31, 41, 55);
            doc.text(this.getRoleName(role), 105, 80, { align: 'center' });
            
            // Materials content
            doc.addPage();
            let yPos = 20;
            
            materials.forEach((section) => {
                // Check if we need a new page
                if (yPos > 250) {
                    doc.addPage();
                    yPos = 20;
                }
                
                // Section title
                doc.setFontSize(14);
                doc.setTextColor(59, 130, 246);
                doc.text(section.title, 20, yPos);
                yPos += 10;
                
                // Section content
                doc.setFontSize(10);
                doc.setTextColor(31, 41, 55);
                const lines = doc.splitTextToSize(section.content, 170);
                doc.text(lines, 20, yPos);
                yPos += lines.length * 5 + 10;
            });
            
            // Add footer
            this.addFooter(doc);
            
            // Save PDF
            const fileName = `strategische-arena-${role}-materialen.pdf`;
            doc.save(fileName);
            
            return { success: true, fileName };
        } catch (error) {
            console.error('Role materials PDF generation failed:', error);
            throw error;
        }
    }

    /**
     * Generate assessment forms for a specific role
     */
    async generateAssessmentForms(role, teamInfo = {}) {
        try {
            await this.loadJsPDF();

            const doc = new this.jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            // Generate forms based on role
            switch(role) {
                case 'rvb':
                    this.generateRvBForms(doc, teamInfo);
                    break;
                case 'rvc':
                    this.generateRvCForm(doc, teamInfo);
                    break;
                case 'invest':
                    this.generateInvestorForm(doc, teamInfo);
                    break;
                case 'toezicht':
                    this.generateToezichthouderForm(doc, teamInfo);
                    break;
                case 'observer':
                    this.generateObserverForm(doc, teamInfo);
                    break;
                case 'teamlead':
                    this.generateTeamLeadChecklist(doc, teamInfo);
                    break;
                default:
                    throw new Error('Unknown role: ' + role);
            }

            // Save PDF
            const fileName = `assessment-formulieren-${role}-${Date.now()}.pdf`;
            doc.save(fileName);

            return { success: true, fileName };
        } catch (error) {
            console.error('Assessment forms generation failed:', error);
            throw error;
        }
    }

    /**
     * Add standard form header with submission instructions
     */
    addFormHeader(doc, formTitle, teamInfo = {}, pageNum = 1) {
        // Border
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.5);
        doc.rect(10, 10, 190, 35);

        // Title
        doc.setFontSize(14);
        doc.setTextColor(59, 130, 246);
        doc.setFont(undefined, 'bold');
        doc.text('DE STRATEGISCHE ARENA - ASSESSMENT FORMULIER', 105, 20, { align: 'center' });

        // Form specific title
        doc.setFontSize(12);
        doc.setTextColor(31, 41, 55);
        doc.text(formTitle, 105, 28, { align: 'center' });

        // Team info fields
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.text('Team: _________', 15, 37);
        doc.text('Ronde: _____', 60, 37);
        doc.text('Datum: __________', 95, 37);
        doc.text(`Rol: ${this.getRoleName(teamInfo.role || '')}`, 140, 37);

        // Warning box
        doc.setFillColor(255, 243, 224);
        doc.rect(10, 48, 190, 12, 'F');
        doc.setTextColor(184, 86, 0);
        doc.setFontSize(9);
        doc.text('BELANGRIJK: Dit formulier moet na afloop worden ingeleverd', 105, 53, { align: 'center' });
        doc.text('Na de presentatie: Geef dit formulier aan je teamleider', 105, 58, { align: 'center' });

        doc.setTextColor(31, 41, 55);
    }

    /**
     * Add standard form footer
     */
    addFormFooter(doc, pageNum = 1, totalPages = 1) {
        const yPos = 280;

        // Footer border
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.5);
        doc.rect(10, yPos - 5, 190, 15);

        // Footer text
        doc.setFontSize(9);
        doc.setTextColor(100, 116, 139);
        doc.text(`Pagina ${pageNum}/${totalPages}`, 20, yPos);
        doc.text('INLEVERINSTRUCTIES: Teamleider verzamelt → Plastic hoes → Docent', 105, yPos, { align: 'center' });
        doc.text('Handtekening: _____________', 140, yPos + 5);
    }

    /**
     * Generate RvB (Raad van Bestuur) forms
     */
    generateRvBForms(doc, teamInfo) {
        // Form 1: Presentation Checklist
        this.addFormHeader(doc, 'RvB PRESENTATIE CHECKLIST', { ...teamInfo, role: 'rvb' });

        let yPos = 70;
        doc.setFontSize(11);
        doc.setFont(undefined, 'bold');
        doc.text('Alle 13 Eindkwalificaties - Afvinken tijdens presentatie:', 20, yPos);

        yPos += 10;
        doc.setFont(undefined, 'normal');
        doc.setFontSize(10);

        const criteria = [
            '1. Conjunctuurgevoeligheid analyse gepresenteerd',
            '2. Macro-economische variabelen impact toegelicht',
            '3. Marktbeschrijving (geografisch & product) gegeven',
            '4. Bedrijfskolom geïllustreerd met sectoren',
            '5. B2C/B2B argumentatie & consumptiegoederen type',
            '6. Prijselasticiteit & substituut invloed uitgelegd',
            '7. Kosten (constant/variabel) verloop beschreven',
            '8. Innovatief gedrag & gevolgen benoemd',
            '9. Marktvorm & marktsituatie beargumenteerd',
            '10. Overheidsrol & invloed beschreven',
            '11. Brede welvaart & maatschappelijke kosten',
            '12. True pricing hoofdlijnen uitgelegd',
            '13. CSRD/ESRS framework toegepast'
        ];

        criteria.forEach((criterion, index) => {
            if (yPos > 240) {
                this.addFormFooter(doc, 1, 2);
                doc.addPage();
                this.addFormHeader(doc, 'RvB PRESENTATIE CHECKLIST (vervolg)', { ...teamInfo, role: 'rvb' });
                yPos = 70;
            }

            // Checkbox
            doc.rect(20, yPos - 3, 4, 4);
            // Criterion text
            doc.text(criterion, 30, yPos);
            // Time field
            doc.text('Tijd: ____', 170, yPos);

            yPos += 8;
        });

        // Notes section
        yPos += 10;
        doc.setFont(undefined, 'bold');
        doc.text('Notities / Ontvangen vragen:', 20, yPos);
        doc.setFont(undefined, 'normal');

        // Add lines for notes
        yPos += 7;
        for (let i = 0; i < 5; i++) {
            doc.line(20, yPos, 190, yPos);
            yPos += 7;
        }

        this.addFormFooter(doc, 1, 1);

        // Form 2: Defense Matrix
        doc.addPage();
        this.addFormHeader(doc, 'RvB DEFENSE MATRIX', { ...teamInfo, role: 'rvb' });

        yPos = 70;
        doc.setFont(undefined, 'bold');
        doc.text('Verwachte Vragen per Stakeholder Groep:', 20, yPos);

        // RvC section
        yPos += 10;
        doc.setFillColor(240, 240, 240);
        doc.rect(20, yPos - 5, 170, 8, 'F');
        doc.text('RvC (focus: governance, risico, lange termijn)', 25, yPos);
        yPos += 10;
        doc.setFont(undefined, 'normal');
        for (let i = 0; i < 3; i++) {
            doc.text(`${i + 1}. `, 25, yPos);
            doc.line(35, yPos, 185, yPos);
            yPos += 7;
        }

        // Investors section
        yPos += 5;
        doc.setFont(undefined, 'bold');
        doc.setFillColor(240, 240, 240);
        doc.rect(20, yPos - 5, 170, 8, 'F');
        doc.text('Investeerders (focus: ROI, groei, marktpositie)', 25, yPos);
        yPos += 10;
        doc.setFont(undefined, 'normal');
        for (let i = 0; i < 3; i++) {
            doc.text(`${i + 1}. `, 25, yPos);
            doc.line(35, yPos, 185, yPos);
            yPos += 7;
        }

        // Toezichthouder section
        yPos += 5;
        doc.setFont(undefined, 'bold');
        doc.setFillColor(240, 240, 240);
        doc.rect(20, yPos - 5, 170, 8, 'F');
        doc.text('Toezichthouder (focus: compliance, publiek belang)', 25, yPos);
        yPos += 10;
        doc.setFont(undefined, 'normal');
        for (let i = 0; i < 3; i++) {
            doc.text(`${i + 1}. `, 25, yPos);
            doc.line(35, yPos, 185, yPos);
            yPos += 7;
        }

        this.addFormFooter(doc, 2, 2);
    }

    /**
     * Generate RvC (Raad van Commissarissen) form
     */
    generateRvCForm(doc, teamInfo) {
        this.addFormHeader(doc, 'RvC GOVERNANCE & RISK ASSESSMENT', { ...teamInfo, role: 'rvc' });

        let yPos = 70;
        doc.setFontSize(11);
        doc.setFont(undefined, 'bold');
        doc.text('EVALUATIECRITERIA - TOEZICHT & STRATEGIE', 20, yPos);

        yPos += 10;

        // Evaluation criteria with focus areas
        const rvcCriteria = [
            { num: 1, title: 'CONJUNCTUURGEVOELIGHEID', questions: [
                'Is de analyse robuust?',
                'Zijn scenario\'s doorgerekend?'
            ]},
            { num: 2, title: 'MACRO-ECONOMISCHE FACTOREN', questions: [
                'Zijn alle relevante variabelen meegenomen?',
                'Is de impact realistisch ingeschat?'
            ]},
            { num: 4, title: 'BEDRIJFSKOLOM & AFHANKELIJKHEDEN', questions: [
                'Zijn ketenrisico\'s geïdentificeerd?',
                'Is verticale integratie overwogen?'
            ]},
            { num: 9, title: 'MARKTPOSITIE & CONCURRENTIE', questions: [
                'Is de marktanalyse accuraat?',
                'Zijn concurrentievoordelen duurzaam?'
            ]},
            { num: 13, title: 'GOVERNANCE & COMPLIANCE', questions: [
                'CSRD implementatie gereed?',
                'ESRS standaarden geïdentificeerd?'
            ]}
        ];

        doc.setFont(undefined, 'normal');
        doc.setFontSize(10);

        rvcCriteria.forEach(criterion => {
            if (yPos > 220) {
                this.addFormFooter(doc, 1, 1);
                doc.addPage();
                this.addFormHeader(doc, 'RvC GOVERNANCE & RISK ASSESSMENT (vervolg)', { ...teamInfo, role: 'rvc' });
                yPos = 70;
            }

            // Criterion header
            doc.rect(20, yPos - 3, 4, 4);
            doc.setFont(undefined, 'bold');
            doc.text(`${criterion.num}. ${criterion.title} (Criterium ${criterion.num})`, 30, yPos);
            doc.setFont(undefined, 'normal');

            yPos += 6;
            criterion.questions.forEach(question => {
                doc.text(`- ${question}`, 35, yPos);
                doc.line(120, yPos, 180, yPos);
                yPos += 5;
            });

            doc.text('Score (1-10):', 35, yPos);
            doc.rect(65, yPos - 3, 15, 5);
            yPos += 10;
        });

        // Question planning section
        yPos += 5;
        doc.setFont(undefined, 'bold');
        doc.text('VRAGENLIJST (5 minuten - prioriteer):', 20, yPos);
        yPos += 7;
        doc.setFont(undefined, 'normal');

        for (let i = 1; i <= 5; i++) {
            doc.text(`${i}.`, 25, yPos);
            doc.line(35, yPos, 185, yPos);
            yPos += 8;
        }

        this.addFormFooter(doc, 1, 1);
    }

    /**
     * Generate Investor form
     */
    generateInvestorForm(doc, teamInfo) {
        this.addFormHeader(doc, 'INVESTMENT ANALYSIS SHEET', { ...teamInfo, role: 'invest' });

        let yPos = 70;
        doc.setFontSize(11);
        doc.setFont(undefined, 'bold');
        doc.text('INVESTERINGSEVALUATIE - FINANCIËLE METRICS', 20, yPos);

        yPos += 10;

        const investCriteria = [
            { num: 6, title: 'PRIJSZETTING & ELASTICITEIT', checks: [
                'Pricing power aanwezig?',
                'Substituut bedreiging?',
                'Inkomenselasticiteit gunstig?'
            ]},
            { num: 7, title: 'KOSTENSTRUCTUUR', checks: [
                'Vaste kosten acceptabel?',
                'Variabele kosten flexibel?',
                'Schaalvoordelen mogelijk?'
            ]},
            { num: 8, title: 'INNOVATIE & GROEI', checks: [
                'Innovatie pipeline sterk?',
                'R&D investeringen adequaat?',
                'First-mover advantages?'
            ]},
            { num: 9, title: 'MARKTMACHT & POSITIE', checks: [
                'Monopolistische kenmerken?',
                'Toetredingsbarrières hoog?',
                'Marktaandeel groeiend?'
            ]}
        ];

        doc.setFont(undefined, 'normal');
        doc.setFontSize(10);

        investCriteria.forEach(criterion => {
            // Criterion header
            doc.rect(20, yPos - 3, 4, 4);
            doc.setFont(undefined, 'bold');
            doc.text(`${criterion.num}. ${criterion.title} (Criterium ${criterion.num})`, 30, yPos);
            doc.setFont(undefined, 'normal');

            yPos += 6;
            criterion.checks.forEach(check => {
                doc.text(`- ${check}`, 35, yPos);
                doc.line(120, yPos, 180, yPos);
                yPos += 5;
            });

            doc.text('Score (1-10):', 35, yPos);
            doc.rect(65, yPos - 3, 15, 5);
            yPos += 10;
        });

        // Investment decision
        yPos += 5;
        doc.setFont(undefined, 'bold');
        doc.text('INVESTERINGSBESLISSING:', 20, yPos);
        yPos += 7;
        doc.setFont(undefined, 'normal');

        const decisions = ['Sterk Kopen', 'Kopen', 'Houden', 'Verkopen'];
        decisions.forEach((decision, index) => {
            doc.rect(25 + (index * 40), yPos - 3, 4, 4);
            doc.text(decision, 30 + (index * 40), yPos);
        });

        yPos += 10;
        doc.text('Rationale:', 20, yPos);
        yPos += 6;
        for (let i = 0; i < 4; i++) {
            doc.line(20, yPos, 190, yPos);
            yPos += 7;
        }

        this.addFormFooter(doc, 1, 1);
    }

    /**
     * Generate Toezichthouder form
     */
    generateToezichthouderForm(doc, teamInfo) {
        this.addFormHeader(doc, 'COMPLIANCE & PUBLIC INTEREST ASSESSMENT', { ...teamInfo, role: 'toezicht' });

        let yPos = 70;
        doc.setFontSize(11);
        doc.setFont(undefined, 'bold');
        doc.text('TOEZICHTHOUDER EVALUATIE - MAATSCHAPPELIJK BELANG', 20, yPos);

        yPos += 10;

        const toezichtCriteria = [
            { num: 10, title: 'OVERHEIDSROL & REGULERING', checks: [
                'Huidige regelgeving nageleefd?',
                'Toekomstige wetgeving voorbereid?',
                'Vergunningen in orde?'
            ]},
            { num: 11, title: 'BREDE WELVAART', checks: [
                'Maatschappelijke kosten erkend?',
                'Negatieve externaliteiten?',
                'Stakeholder belangen afgewogen?'
            ]},
            { num: 12, title: 'TRUE PRICING', checks: [
                'Werkelijke kosten doorberekend?',
                'Transparantie aanwezig?',
                'Duurzaamheidsimpact gemeten?'
            ]},
            { num: 13, title: 'CSRD/ESRS COMPLIANCE', checks: [
                'CSRD framework begrepen?',
                'Relevante ESRS benoemd?',
                'Rapportage voorbereid?'
            ]}
        ];

        doc.setFont(undefined, 'normal');
        doc.setFontSize(10);

        toezichtCriteria.forEach(criterion => {
            // Criterion header
            doc.rect(20, yPos - 3, 4, 4);
            doc.setFont(undefined, 'bold');
            doc.text(`${criterion.num}. ${criterion.title} (Criterium ${criterion.num})`, 30, yPos);
            doc.setFont(undefined, 'normal');

            yPos += 6;
            criterion.checks.forEach(check => {
                doc.text(`- ${check}`, 35, yPos);
                doc.line(120, yPos, 180, yPos);
                yPos += 5;
            });

            doc.text('Score (1-10):', 35, yPos);
            doc.rect(65, yPos - 3, 15, 5);
            yPos += 10;
        });

        // Enforcement actions
        yPos += 5;
        doc.setFont(undefined, 'bold');
        doc.text('HANDHAVINGSACTIES:', 20, yPos);
        yPos += 7;
        doc.setFont(undefined, 'normal');

        const actions = ['Geen', 'Waarschuwing', 'Boete', 'Verder onderzoek'];
        actions.forEach((action, index) => {
            doc.rect(25 + (index * 40), yPos - 3, 4, 4);
            doc.text(action, 30 + (index * 40), yPos);
        });

        yPos += 10;
        doc.text('Toelichting:', 20, yPos);
        yPos += 6;
        for (let i = 0; i < 4; i++) {
            doc.line(20, yPos, 190, yPos);
            yPos += 7;
        }

        this.addFormFooter(doc, 1, 1);
    }

    /**
     * Generate Observer scorecard
     */
    generateObserverForm(doc, teamInfo) {
        this.addFormHeader(doc, 'OBSERVER COMPREHENSIVE SCORECARD', { ...teamInfo, role: 'observer' });

        let yPos = 70;
        doc.setFontSize(11);
        doc.setFont(undefined, 'bold');
        doc.text('OBSERVER SCORECARD - ALLE CRITERIA', 20, yPos);

        yPos += 10;
        doc.setFontSize(10);
        doc.text('PRESENTATIE KWALITEIT (RvB beoordeling):', 20, yPos);

        yPos += 8;

        // Create evaluation table
        const allCriteria = [
            '1. Conjunctuurgevoeligheid',
            '2. Macro-economische variabelen',
            '3. Marktbeschrijving',
            '4. Bedrijfskolom',
            '5. B2C/B2B argumentatie',
            '6. Elasticiteiten',
            '7. Kostenstructuur',
            '8. Innovatie',
            '9. Marktvorm',
            '10. Overheidsrol',
            '11. Brede welvaart',
            '12. True pricing',
            '13. CSRD/ESRS'
        ];

        // Table header
        doc.setFillColor(240, 240, 240);
        doc.rect(20, yPos, 170, 7, 'F');
        doc.setFont(undefined, 'bold');
        doc.text('Criterium', 25, yPos + 5);
        doc.text('Score', 140, yPos + 5);
        doc.text('Notities', 160, yPos + 5);

        yPos += 8;
        doc.setFont(undefined, 'normal');

        allCriteria.forEach(criterion => {
            if (yPos > 230) {
                this.addFormFooter(doc, 1, 2);
                doc.addPage();
                this.addFormHeader(doc, 'OBSERVER SCORECARD (vervolg)', { ...teamInfo, role: 'observer' });
                yPos = 70;
            }

            doc.text(criterion, 25, yPos);
            doc.rect(140, yPos - 3, 12, 5);
            doc.text('/10', 153, yPos);
            doc.line(160, yPos, 185, yPos);
            yPos += 7;
        });

        // Total score
        yPos += 5;
        doc.setFont(undefined, 'bold');
        doc.text('TOTAALSCORE:', 25, yPos);
        doc.rect(60, yPos - 3, 20, 6);
        doc.text('/ 130', 81, yPos);

        // Q&A Performance
        yPos += 10;
        doc.text('Q&A PERFORMANCE:', 20, yPos);
        yPos += 7;
        doc.setFont(undefined, 'normal');

        const qaGroups = ['RvC vragen', 'Investeerder vragen', 'Toezichthouder vragen'];
        qaGroups.forEach(group => {
            doc.text(`${group}:`, 25, yPos);
            ['Zwak', 'Voldoende', 'Goed'].forEach((level, index) => {
                doc.rect(80 + (index * 25), yPos - 3, 4, 4);
                doc.text(level, 85 + (index * 25), yPos);
            });
            yPos += 7;
        });

        // 1-minute advice preparation
        if (yPos > 220) {
            this.addFormFooter(doc, 1, 2);
            doc.addPage();
            this.addFormHeader(doc, 'OBSERVER SCORECARD (vervolg)', { ...teamInfo, role: 'observer' });
            yPos = 70;
        }

        yPos += 5;
        doc.setFont(undefined, 'bold');
        doc.text('1-MINUUT ADVIES VOORBEREIDING:', 20, yPos);
        yPos += 7;
        doc.setFont(undefined, 'normal');

        doc.text('Hoofdconclusie:', 25, yPos);
        doc.line(55, yPos, 185, yPos);
        yPos += 8;

        doc.text('3 Sterke punten:', 25, yPos);
        yPos += 6;
        for (let i = 1; i <= 3; i++) {
            doc.text(`${i}.`, 30, yPos);
            doc.line(35, yPos, 90, yPos);
            yPos += 6;
        }

        doc.text('3 Verbeterpunten:', 100, yPos - 18);
        yPos = yPos - 18 + 6;
        for (let i = 1; i <= 3; i++) {
            doc.text(`${i}.`, 105, yPos);
            doc.line(110, yPos, 185, yPos);
            yPos += 6;
        }

        yPos += 2;
        doc.text('Eindadvies:', 25, yPos);
        doc.line(50, yPos, 185, yPos);

        this.addFormFooter(doc, 2, 2);
    }

    /**
     * Generate Team Lead collection checklist
     */
    generateTeamLeadChecklist(doc, teamInfo) {
        this.addFormHeader(doc, 'TEAMLEIDER VERZAMELFORMULIER', { ...teamInfo, role: 'teamlead' });

        // Add extra warning
        doc.setFillColor(255, 200, 200);
        doc.rect(10, 63, 190, 10, 'F');
        doc.setTextColor(200, 0, 0);
        doc.setFont(undefined, 'bold');
        doc.setFontSize(11);
        doc.text('VERPLICHT IN TE LEVEREN - VERZAMEL ALLE DOCUMENTEN VAN JE TEAM', 105, 69, { align: 'center' });

        let yPos = 85;
        doc.setTextColor(31, 41, 55);
        doc.setFont(undefined, 'bold');
        doc.setFontSize(12);
        doc.text('DOCUMENTEN CHECKLIST:', 20, yPos);

        yPos += 10;
        doc.setFont(undefined, 'normal');
        doc.setFontSize(10);

        // Document checklist
        const documents = [
            { role: 'RvB', docs: [
                'RvB Presentation Checklist (per teamlid)',
                'RvB Defense Matrix (per teamlid)'
            ]},
            { role: 'RvC', docs: [
                'RvC Governance Assessment Forms'
            ]},
            { role: 'Investeerders', docs: [
                'Investor Analysis Sheets'
            ]},
            { role: 'Toezichthouder', docs: [
                'Toezichthouder Compliance Forms'
            ]},
            { role: 'Observatoren', docs: [
                'Observer Scorecards (alle observerende leden)'
            ]}
        ];

        documents.forEach(section => {
            doc.setFont(undefined, 'bold');
            doc.text(`${section.role}:`, 25, yPos);
            yPos += 6;
            doc.setFont(undefined, 'normal');

            section.docs.forEach(docName => {
                doc.rect(30, yPos - 3, 4, 4);
                doc.text(docName, 37, yPos);
                doc.text('Aantal: ____', 150, yPos);
                yPos += 6;
            });
            yPos += 3;
        });

        // Summary section
        yPos += 5;
        doc.setFont(undefined, 'bold');
        doc.text('SAMENVATTING:', 20, yPos);
        yPos += 7;
        doc.setFont(undefined, 'normal');

        doc.text('Totaal aantal formulieren:', 25, yPos);
        doc.rect(75, yPos - 3, 20, 6);

        yPos += 10;
        doc.text('Ontbrekende formulieren:', 25, yPos);
        yPos += 6;
        doc.line(25, yPos, 185, yPos);
        yPos += 7;
        doc.line(25, yPos, 185, yPos);

        // Signature section
        yPos += 15;
        doc.setFillColor(240, 240, 240);
        doc.rect(20, yPos - 5, 170, 30, 'F');

        doc.setFont(undefined, 'bold');
        doc.text('ONDERTEKENING:', 25, yPos);
        yPos += 8;
        doc.setFont(undefined, 'normal');

        doc.text('Teamleider naam:', 30, yPos);
        doc.line(65, yPos, 120, yPos);
        doc.text('Handtekening:', 130, yPos);
        doc.line(160, yPos, 185, yPos);

        yPos += 10;
        doc.text('Docent ontvangst:', 30, yPos);
        doc.line(65, yPos, 120, yPos);
        doc.text('Tijd:', 130, yPos);
        doc.line(145, yPos, 185, yPos);

        this.addFormFooter(doc, 1, 1);
    }

    /**
     * Helper methods
     */
    getRoleName(role) {
        const roleNames = {
            'rvb': 'Raad van Bestuur',
            'rvc': 'Raad van Commissarissen',
            'or': 'Ondernemingsraad',
            'invest': 'Investeerders',
            'toezicht': 'Toezichthouder',
            'observer': 'Observator',
            'teamlead': 'Teamleider'
        };
        return roleNames[role] || 'Onbekende Rol';
    }

    getRoleDescription(role) {
        const descriptions = {
            'rvb': 'Verantwoordelijk voor strategie, operationele beslissingen en waardecreatie',
            'rvc': 'Toezicht op bestuur, governance en lange termijn continuïteit',
            'or': 'Vertegenwoordiging werknemersbelangen en organisatiecultuur',
            'invest': 'Focus op rendement, groei en waardering',
            'toezicht': 'Handhaving regelgeving en maatschappelijk belang'
        };
        return descriptions[role] || '';
    }

    getModuleName(module) {
        const moduleNames = {
            'companyInfo': 'Bedrijfsinformatie',
            'economicAnalysis': 'Economische Analyse',
            'marketStructure': 'Marktstructuur',
            'esgFactors': 'ESG-factoren',
            'qaSimulator': 'Q&A Simulator',
            'presentation': 'Presentatievoorbereiding',
            'teamCoordination': 'Teamcoördinatie'
        };
        return moduleNames[module] || module;
    }

    calculateOverallProgress(progress) {
        const modules = progress.modules || {};
        const totalModules = Object.keys(modules).length || 1;
        const completedModules = Object.values(modules).filter(Boolean).length;
        return (completedModules / totalModules) * 100;
    }

    /**
     * Show loading indicator
     */
    showLoadingIndicator() {
        const indicator = document.createElement('div');
        indicator.id = 'pdf-loading';
        indicator.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        indicator.innerHTML = `
            <div class="bg-white rounded-lg p-6 max-w-sm">
                <div class="flex items-center space-x-3">
                    <svg class="animate-spin h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <div>
                        <p class="text-gray-900 font-medium">PDF Genereren...</p>
                        <p class="text-gray-500 text-sm">Even geduld alstublieft</p>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(indicator);
    }

    /**
     * Hide loading indicator
     */
    hideLoadingIndicator() {
        const indicator = document.getElementById('pdf-loading');
        if (indicator) {
            indicator.remove();
        }
    }

    /**
     * Generate and download PDF with loading state
     */
    async generateWithUI(type, data) {
        try {
            this.showLoadingIndicator();

            let result;
            if (type === 'summary') {
                result = await this.generatePreparationSummary(data);
            } else if (type === 'materials') {
                result = await this.generateRoleMaterials(data.role, data.materials);
            } else if (type === 'assessment-forms') {
                result = await this.generateAssessmentForms(data.role, data.teamInfo);
            }

            this.hideLoadingIndicator();

            // Show success message
            this.showSuccessMessage(result.fileName);

            return result;
        } catch (error) {
            this.hideLoadingIndicator();
            this.showErrorMessage(error.message);
            throw error;
        }
    }

    /**
     * Show success message
     */
    showSuccessMessage(fileName) {
        const message = document.createElement('div');
        message.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg z-50 animate-fade-in';
        message.innerHTML = `
            <div class="flex items-center space-x-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>PDF ${fileName} succesvol gegenereerd!</span>
            </div>
        `;
        document.body.appendChild(message);
        
        setTimeout(() => message.remove(), 5000);
    }

    /**
     * Show error message
     */
    showErrorMessage(error) {
        const message = document.createElement('div');
        message.className = 'fixed bottom-4 right-4 bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg z-50 animate-fade-in';
        message.innerHTML = `
            <div class="flex items-center space-x-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
                <span>Fout bij genereren PDF: ${error}</span>
            </div>
        `;
        document.body.appendChild(message);
        
        setTimeout(() => message.remove(), 5000);
    }
}

// Export singleton instance
export const pdfGenerator = new PDFGenerator();