/**
 * Form Generator for De Strategische Arena Assessment
 * Generates printable assessment forms for different roles
 */

function generateForm(type) {
    const formContent = getFormContent(type);
    const printWindow = window.open('', '_blank');
    printWindow.document.write(formContent);
    printWindow.document.close();
    printWindow.print();
}

function getFormContent(type) {
    const date = new Date().toLocaleDateString('nl-NL');
    let title = '';
    let fields = '';

    switch(type) {
        case 'rvb':
            title = 'Raad van Bestuur Assessment Form';
            fields = getRvBFields();
            break;
        case 'rvc':
            title = 'Raad van Commissarissen Assessment Form';
            fields = getRvCFields();
            break;
        case 'investor':
            title = 'Investeerder Assessment Form';
            fields = getInvestorFields();
            break;
        case 'toezichthouder':
            title = 'Toezichthouders & Stakeholders Assessment Form';
            fields = getToezichthouderFields();
            break;
        case 'teamlead':
            title = 'Team Lead Checklist';
            fields = getTeamLeadFields();
            break;
        case 'observer':
            title = 'Observer Assessment Form';
            fields = getObserverFields();
            break;
        default:
            title = 'Assessment Observatie Form';
            fields = getBlankFields();
    }

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>${title}</title>
            <style>
                body { font-family: Arial, sans-serif; max-width: 800px; margin: 20px auto; }
                h1 { border-bottom: 2px solid #333; padding-bottom: 10px; }
                .header { display: flex; justify-content: space-between; margin-bottom: 20px; }
                .field { margin-bottom: 15px; }
                .field label { font-weight: bold; display: inline-block; width: 150px; }
                .field input { border: none; border-bottom: 1px solid #333; width: 300px; }
                .section { margin: 30px 0; padding: 15px; border: 1px solid #ddd; }
                .notes { margin-top: 20px; }
                .notes-area { width: 100%; height: 150px; border: 1px solid #333; }
                table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                th, td { border: 1px solid #333; padding: 8px; text-align: left; }
                .signature { margin-top: 40px; border-top: 1px solid #333; width: 300px; }
                @media print { body { margin: 10px; } }
            </style>
        </head>
        <body>
            <h1>${title}</h1>
            <div class="header">
                <div class="field">
                    <label>Naam:</label>
                    <input type="text" />
                </div>
                <div class="field">
                    <label>Studentnummer:</label>
                    <input type="text" />
                </div>
            </div>
            <div class="header">
                <div class="field">
                    <label>Team:</label>
                    <input type="text" />
                </div>
                <div class="field">
                    <label>Datum:</label>
                    <input type="text" value="${date}" />
                </div>
            </div>
            ${fields}
            <div class="signature">Handtekening</div>
        </body>
        </html>
    `;
}

function getRvBFields() {
    return `
        <div class="section">
            <h2>Rol: Raad van Bestuur</h2>
            <div class="field">
                <label>Subrol:</label>
                <input type="text" placeholder="CEO / CFO / CTO / COO / CSO" />
            </div>
        </div>
        <table>
            <tr>
                <th width="100">Tijd/Fase</th>
                <th>Vraag Ontvangen</th>
                <th>Antwoord Gegeven</th>
                <th width="100">Beoordeling</th>
            </tr>
            ${[...Array(10)].map(() => `
                <tr>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                </tr>
            `).join('')}
        </table>
        <div class="notes">
            <h3>Strategische Observaties</h3>
            <textarea class="notes-area"></textarea>
        </div>
        <div class="notes">
            <h3>Risico Analyse</h3>
            <textarea class="notes-area"></textarea>
        </div>
    `;
}

function getRvCFields() {
    return `
        <div class="section">
            <h2>Rol: Raad van Commissarissen</h2>
            <div class="field">
                <label>Subrol:</label>
                <input type="text" placeholder="Strategie & Innovatie / ESG & Duurzaamheid / Digital & Technology / Audit / Remuneratie / Governance" />
            </div>
        </div>
        <table>
            <tr>
                <th width="100">Tijd/Fase</th>
                <th>Toezicht Punt</th>
                <th>Observatie</th>
                <th width="100">Actie Vereist</th>
            </tr>
            ${[...Array(10)].map(() => `
                <tr>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                </tr>
            `).join('')}
        </table>
        <div class="notes">
            <h3>Governance Evaluatie</h3>
            <textarea class="notes-area"></textarea>
        </div>
        <div class="notes">
            <h3>Compliance Check</h3>
            <textarea class="notes-area"></textarea>
        </div>
    `;
}

function getInvestorFields() {
    return `
        <div class="section">
            <h2>Rol: Investeerder</h2>
            <div class="field">
                <label>Subrol:</label>
                <input type="text" placeholder="Pensioenfonds / Vreemd Vermogen / Value Investor / Hedge Fund / Activist Investor" />
            </div>
        </div>
        <table>
            <tr>
                <th width="100">Tijd/Fase</th>
                <th>Financieel Aspect</th>
                <th>Evaluatie</th>
                <th width="100">Impact (1-10)</th>
            </tr>
            ${[...Array(10)].map(() => `
                <tr>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                </tr>
            `).join('')}
        </table>
        <div class="notes">
            <h3>ROI Analyse</h3>
            <textarea class="notes-area"></textarea>
        </div>
        <div class="notes">
            <h3>Investment Recommendation</h3>
            <textarea class="notes-area"></textarea>
        </div>
    `;
}

function getToezichthouderFields() {
    return `
        <div class="section">
            <h2>Rol: Toezichthouder/Stakeholder</h2>
            <div class="field">
                <label>Organisatie:</label>
                <input type="text" placeholder="AFM / ACM / AP / FNV / Milieudefensie / RVO-EIC" />
            </div>
        </div>
        <table>
            <tr>
                <th width="100">Tijd/Fase</th>
                <th>Kritische Vraag/Eis</th>
                <th>Respons Bedrijf</th>
                <th width="100">Voldoende?</th>
            </tr>
            ${[...Array(10)].map(() => `
                <tr>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                </tr>
            `).join('')}
        </table>
        <div class="notes">
            <h3>Compliance Issues</h3>
            <textarea class="notes-area"></textarea>
        </div>
        <div class="notes">
            <h3>Aanbevelingen/Eisen</h3>
            <textarea class="notes-area"></textarea>
        </div>
    `;
}

function getTeamLeadFields() {
    return `
        <div class="section">
            <h2>Team Lead Checklist</h2>
        </div>
        <table>
            <tr>
                <th>Teamlid Naam</th>
                <th>Rol</th>
                <th>Formulieren Compleet</th>
                <th>Handtekening</th>
                <th>Check</th>
            </tr>
            ${[...Array(6)].map(() => `
                <tr>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>☐</td>
                </tr>
            `).join('')}
        </table>
        <div class="section">
            <h3>Inlever Checklist</h3>
            <p>☐ Alle formulieren verzameld</p>
            <p>☐ Namen en studentnummers compleet</p>
            <p>☐ Handtekeningen aanwezig</p>
            <p>☐ Formulieren geniet/getackt</p>
            <p>☐ Gesorteerd per teamlid</p>
            <p>☐ Ingeleverd bij docent</p>
        </div>
        <div class="field">
            <label>Team Lead Naam:</label>
            <input type="text" />
        </div>
    `;
}

function getObserverFields() {
    return `
        <div class="section">
            <h2>Observer Assessment - De Strategische Arena</h2>
            <div class="field">
                <label>Team Observed:</label>
                <input type="text" placeholder="Team naam/nummer" />
            </div>
        </div>

        <div class="section" style="margin-top: 20px;">
            <h3>Rolverdeling & Kwaliteit</h3>
            <table>
                <tr>
                    <th width="200">Rol</th>
                    <th width="200">Gespeeld door</th>
                    <th width="100">Kwaliteit (1-10)</th>
                    <th>Observaties</th>
                </tr>
                <tr>
                    <td><strong>Raad van Bestuur</strong></td>
                    <td>&nbsp;</td>
                    <td style="text-align: center;">&nbsp;</td>
                    <td>&nbsp;</td>
                </tr>
                <tr>
                    <td style="padding-left: 20px;">- CEO</td>
                    <td>&nbsp;</td>
                    <td style="text-align: center;">&nbsp;</td>
                    <td>&nbsp;</td>
                </tr>
                <tr>
                    <td style="padding-left: 20px;">- CFO</td>
                    <td>&nbsp;</td>
                    <td style="text-align: center;">&nbsp;</td>
                    <td>&nbsp;</td>
                </tr>
                <tr>
                    <td style="padding-left: 20px;">- CTO</td>
                    <td>&nbsp;</td>
                    <td style="text-align: center;">&nbsp;</td>
                    <td>&nbsp;</td>
                </tr>
                <tr>
                    <td style="padding-left: 20px;">- COO</td>
                    <td>&nbsp;</td>
                    <td style="text-align: center;">&nbsp;</td>
                    <td>&nbsp;</td>
                </tr>
                <tr>
                    <td style="padding-left: 20px;">- CSO</td>
                    <td>&nbsp;</td>
                    <td style="text-align: center;">&nbsp;</td>
                    <td>&nbsp;</td>
                </tr>
                <tr>
                    <td><strong>Raad van Commissarissen</strong></td>
                    <td>&nbsp;</td>
                    <td style="text-align: center;">&nbsp;</td>
                    <td>&nbsp;</td>
                </tr>
                <tr>
                    <td><strong>Investeerders</strong></td>
                    <td>&nbsp;</td>
                    <td style="text-align: center;">&nbsp;</td>
                    <td>&nbsp;</td>
                </tr>
                <tr>
                    <td><strong>Toezichthouders/Stakeholders</strong></td>
                    <td>&nbsp;</td>
                    <td style="text-align: center;">&nbsp;</td>
                    <td>&nbsp;</td>
                </tr>
            </table>
        </div>

        <div class="section" style="margin-top: 20px;">
            <h3>Thematische Beoordeling - Bedrijfseconomische Criteria</h3>
            <table>
                <tr>
                    <th width="30">#</th>
                    <th width="250">Criterium</th>
                    <th width="100">Score (1-10)</th>
                    <th>Notities</th>
                </tr>
                <tr>
                    <td>1</td>
                    <td><strong>Conjunctuurgevoeligheid</strong></td>
                    <td style="text-align: center;">&nbsp;</td>
                    <td>&nbsp;</td>
                </tr>
                <tr>
                    <td>2</td>
                    <td><strong>Macro-economische variabelen</strong></td>
                    <td style="text-align: center;">&nbsp;</td>
                    <td>&nbsp;</td>
                </tr>
                <tr>
                    <td>3</td>
                    <td><strong>Marktbeschrijving</strong></td>
                    <td style="text-align: center;">&nbsp;</td>
                    <td>&nbsp;</td>
                </tr>
                <tr>
                    <td>4</td>
                    <td><strong>Bedrijfskolom</strong></td>
                    <td style="text-align: center;">&nbsp;</td>
                    <td>&nbsp;</td>
                </tr>
                <tr>
                    <td>5</td>
                    <td><strong>B2C/B2B argumentatie</strong></td>
                    <td style="text-align: center;">&nbsp;</td>
                    <td>&nbsp;</td>
                </tr>
                <tr>
                    <td>6</td>
                    <td><strong>Elasticiteiten</strong></td>
                    <td style="text-align: center;">&nbsp;</td>
                    <td>&nbsp;</td>
                </tr>
                <tr>
                    <td>7</td>
                    <td><strong>Kostenstructuur</strong></td>
                    <td style="text-align: center;">&nbsp;</td>
                    <td>&nbsp;</td>
                </tr>
                <tr>
                    <td>8</td>
                    <td><strong>Innovatie</strong></td>
                    <td style="text-align: center;">&nbsp;</td>
                    <td>&nbsp;</td>
                </tr>
                <tr>
                    <td>9</td>
                    <td><strong>Marktvorm</strong></td>
                    <td style="text-align: center;">&nbsp;</td>
                    <td>&nbsp;</td>
                </tr>
                <tr>
                    <td>10</td>
                    <td><strong>Overheidsrol</strong></td>
                    <td style="text-align: center;">&nbsp;</td>
                    <td>&nbsp;</td>
                </tr>
                <tr>
                    <td>11</td>
                    <td><strong>Brede welvaart</strong></td>
                    <td style="text-align: center;">&nbsp;</td>
                    <td>&nbsp;</td>
                </tr>
                <tr>
                    <td>12</td>
                    <td><strong>True pricing</strong></td>
                    <td style="text-align: center;">&nbsp;</td>
                    <td>&nbsp;</td>
                </tr>
                <tr>
                    <td>13</td>
                    <td><strong>CSRD/ESRS</strong></td>
                    <td style="text-align: center;">&nbsp;</td>
                    <td>&nbsp;</td>
                </tr>
            </table>
        </div>

        <div class="section" style="margin-top: 20px;">
            <h3>Kritische Vragen & Antwoorden</h3>
            <table>
                <tr>
                    <th width="100">Tijd</th>
                    <th width="150">Vraagsteller</th>
                    <th width="250">Vraag</th>
                    <th>Antwoord Kwaliteit</th>
                </tr>
                ${[...Array(10)].map(() => `
                    <tr style="height: 35px;">
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                    </tr>
                `).join('')}
            </table>
        </div>

        <div class="section" style="margin-top: 20px;">
            <h3>Algemene Evaluatie</h3>
            <table>
                <tr>
                    <th width="300">Criterium</th>
                    <th width="100">Score (1-10)</th>
                    <th>Toelichting</th>
                </tr>
                <tr>
                    <td>Presentatie Kwaliteit</td>
                    <td style="text-align: center;">&nbsp;</td>
                    <td>&nbsp;</td>
                </tr>
                <tr>
                    <td>Inhoudelijke Diepgang</td>
                    <td style="text-align: center;">&nbsp;</td>
                    <td>&nbsp;</td>
                </tr>
                <tr>
                    <td>Rolvastheid</td>
                    <td style="text-align: center;">&nbsp;</td>
                    <td>&nbsp;</td>
                </tr>
                <tr>
                    <td>Interactie & Discussie</td>
                    <td style="text-align: center;">&nbsp;</td>
                    <td>&nbsp;</td>
                </tr>
                <tr>
                    <td>Teamwork & Coördinatie</td>
                    <td style="text-align: center;">&nbsp;</td>
                    <td>&nbsp;</td>
                </tr>
            </table>
        </div>

        <div class="notes" style="margin-top: 20px;">
            <h3>Sterke Punten</h3>
            <textarea class="notes-area" style="height: 80px;"></textarea>
        </div>

        <div class="notes">
            <h3>Verbeterpunten</h3>
            <textarea class="notes-area" style="height: 80px;"></textarea>
        </div>

        <div style="margin-top: 30px; display: flex; justify-content: space-between;">
            <div class="field">
                <label>Totaalscore:</label>
                <input type="text" style="width: 50px; text-align: center;" /> / 100
            </div>
            <div class="field">
                <label>Observer Team:</label>
                <input type="text" style="width: 200px;" />
            </div>
        </div>
    `;
}

function getBlankFields() {
    return `
        <div class="section">
            <h2>Algemene Observaties</h2>
        </div>
        <table>
            <tr>
                <th width="100">Tijd/Fase</th>
                <th>Observatie</th>
                <th>Notities</th>
            </tr>
            ${[...Array(15)].map(() => `
                <tr>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                </tr>
            `).join('')}
        </table>
        <div class="notes">
            <h3>Aanvullende Notities</h3>
            <textarea class="notes-area" style="height: 300px;"></textarea>
        </div>
    `;
}

// Make functions globally available
window.generateForm = generateForm;