import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdf from './pdf-report';

export class CathPciReport {
  data: any = null;
  content: pdfMake.Content;

  constructor(data: any) {
    this.data = data;
    this.content = [
      {
        table: {
          widths: ['*'],
          heights: [30],
          headerRows: 1,
          body: [
            [
              {
                columns: [
                  { text: 'BDMS', alignment: 'left', width: 100 },
                  { text: 'Data Collection Form', bold: true, alignment: 'center' },
                  { text: 'CathPCI Registry', alignment: 'center', width: 155 }
                ],
                style: 'header'
              }
            ],
            // // page 1
            // ...this.sectionA(),
            // ...this.sectionB(),
            // ...this.sectionC(),
            // // page 2
            // ...this.sectionD(),
            // page 3
            ...this.sectionE(),
            ...this.sectionF()
          ]
        }
      }
      // { text: 'Siriwasan', absolutePosition: { x: 300, y: 300 } },
      // { text: 'Siriwasan', relativePosition: { x: 200, y: 200 } }
    ];
  }

  get docDefinition(): pdfMake.TDocumentDefinitions {
    return {
      footer(currentPage, pageCount, pageSize) {
        return { text: currentPage.toString() + ' of ' + pageCount, alignment: 'center' };
      },
      header(currentPage, pageCount, pageSize) {
        return [
          { text: 'simple text', alignment: currentPage % 2 ? 'left' : 'right' }
          // { canvas: [{ type: 'rect', x: 170, y: 32, w: pageSize.width - 170, h: 40 }] }
        ];
      },
      content: this.content,
      styles: pdf.styles,
      defaultStyle: pdf.defaultStyle
    };
  }

  private sectionA(): pdfMake.Content[][] {
    return [
      [pdf.section('A. DEMOGRAPHICS')],
      [
        pdf.stack(
          pdf.emptyLine(),
          pdf.columns(
            pdf.blockStyle(
              { lineHeight: 1.1 },
              pdf.field('Registry Id'),
              pdf.input(this.data.sectionA.registryId)
            ),
            pdf.blockStyle({ lineHeight: 1.1 }, pdf.field('HN'), pdf.input(this.data.sectionA.HN)),
            pdf.blockStyle({ lineHeight: 1.1 }, pdf.field('AN'), pdf.input(this.data.sectionA.AN))
          ),
          pdf.columns(
            pdf.block(
              pdf.field('Last Name', { annotation: '2000' }),
              pdf.inputThai(this.data.sectionA.LastName)
            ),
            pdf.block(
              pdf.field('First Name', { annotation: '2010' }),
              pdf.inputThai(this.data.sectionA.FirstName)
            ),
            pdf.block(
              pdf.field('Middle Name', { annotation: '2020' }),
              pdf.inputThai(this.data.sectionA.MidName)
            )
          ),
          pdf.columns(
            pdf.block(
              pdf.field('Birth Date', { annotation: '2050' }),
              pdf.date(this.data.sectionA.DOB)
            ),
            pdf.block(pdf.field('Age'), pdf.input(this.data.sectionA.Age), ' years'),
            pdf.block(
              pdf.field('Sex', { annotation: '2060' }),
              pdf.tab(),
              pdf.radio('Male', this.data.sectionA.Sex),
              pdf.tab(),
              pdf.radio('Female', this.data.sectionA.Sex)
            )
          ),
          pdf.block(pdf.field('SSN', { annotation: '2030' }), pdf.input(this.data.sectionA.SSN)),
          pdf.columns(
            pdf.block(
              pdf.field('Race'),
              pdf.tab(),
              pdf.radio('White', this.data.sectionA.Race, { annotation: '2070' }),
              pdf.tab(),
              pdf.radio('Black/African American', this.data.sectionA.Race, {
                annotation: '2071'
              }),
              pdf.tab(),
              pdf.radio('European', this.data.sectionA.Race),
              pdf.tab(),
              pdf.radio('Asian', this.data.sectionA.Race, { annotation: '2072' })
            ),
            pdf.blockStyle(
              { width: 150 },
              pdf.field('Nationality', { width: 150 }),
              pdf.input(this.data.sectionA.PatNation)
            )
          ),
          pdf.columns(
            pdf.block(
              pdf.field(`Is This Patient's Permanet Address`),
              pdf.tab(),
              pdf.radio('Yes', this.data.sectionA.PermAddr),
              pdf.tab(),
              pdf.radio('No', this.data.sectionA.PermAddr)
            ),
            pdf.block(
              pdf.arrowIf(),
              ' Yes, ',
              pdf.field('Zip Code'),
              pdf.input(this.data.sectionA.ZipCode)
            )
          )
        )
      ]
    ];
  }

  private sectionB(): pdfMake.Content[][] {
    return [
      [pdf.section('B. EPISODE OF CARE')],
      [
        pdf.stack(
          pdf.block(pdf.field('Hospital Name'), pdf.inputThai(this.data.sectionB.HospName)),
          pdf.block(
            pdf.field('Admission Type'),
            pdf.tab(),
            pdf.radio('Direct', this.data.sectionB.AdmType),
            pdf.tab(),
            pdf.radio('Transfer', this.data.sectionB.AdmType)
          ),
          pdf.block(
            pdf.tab(),
            pdf.arrowIf(),
            ' Transfer, ',
            pdf.field('form Healthcare Center'),
            pdf.tab(),
            pdf.radio('BDMS Network', this.data.sectionB.TransferHospType),
            ': ',
            pdf.input(this.data.sectionB.BDMSNetwork),
            pdf.tab(5),
            pdf.radio('Non BDMS', this.data.sectionB.TransferHospType),
            pdf.input(this.data.sectionB.NonBDMS)
          ),
          pdf.block(
            pdf.field('Arrival Date/Time', { annotation: '3001' }),
            pdf.date(this.data.sectionB.ArrivalDateTime, 'datetime')
          ),
          pdf.columns(
            pdf.block(
              pdf.field('Admitting Provider', { annotation: '3050,3051' }),
              pdf.inputThai(this.data.sectionB.AdmProvider)
            ),
            pdf.block(
              pdf.field('Attending Provider', { annotation: '3055,3056' }),
              pdf.inputThai(this.data.sectionB.AttProvider)
            )
          ),
          {
            table: {
              widths: ['*', '*'],
              headerRows: 2,
              body: [
                [
                  { text: 'Payment Source', style: 'tableHeader', colSpan: 2, alignment: 'center' },
                  {}
                ],
                [
                  { text: 'Primary Payor', style: 'tableHeader' },
                  { text: 'Secondary Payor', style: 'tableHeader' }
                ],
                [
                  pdf.stack(
                    pdf.emptyLine(),
                    pdf.block(
                      pdf.radio('Self', this.data.sectionB.PayorPrim),
                      pdf.tab(),
                      pdf.radio('Corporate', this.data.sectionB.PayorPrim),
                      pdf.tab(),
                      pdf.radio('Embassy', this.data.sectionB.PayorPrim),
                      pdf.tab(),
                      pdf.radio('Other', this.data.sectionB.PayorPrim)
                    ),
                    pdf.block(
                      pdf.radio('Private Health Insurance', this.data.sectionB.PayorPrim),
                      pdf.tab(),
                      pdf.radio('SSO (Social Security Office)', this.data.sectionB.PayorPrim)
                    ),
                    pdf.radio('Charitable care/Foundation Funding', this.data.sectionB.PayorPrim),
                    pdf.radio(`Comptroller General's Department`, this.data.sectionB.PayorPrim),
                    pdf.radio(
                      'NHSO (National Health Security Office)',
                      this.data.sectionB.PayorPrim
                    )
                  ),
                  pdf.stack(
                    pdf.emptyLine(),
                    pdf.block(
                      pdf.radio('None', this.data.sectionB.PayorSecond),
                      pdf.tab(),
                      pdf.radio('Corporate', this.data.sectionB.PayorSecond),
                      pdf.tab(),
                      pdf.radio('Embassy', this.data.sectionB.PayorSecond),
                      pdf.tab(),
                      pdf.radio('Other', this.data.sectionB.PayorSecond)
                    ),
                    pdf.block(
                      pdf.radio('Private Health Insurance', this.data.sectionB.PayorSecond),
                      pdf.tab(),
                      pdf.radio('SSO (Social Security Office)', this.data.sectionB.PayorSecond)
                    ),
                    pdf.radio('Charitable care/Foundation Funding', this.data.sectionB.PayorSecond),
                    pdf.radio(`Comptroller General's Department`, this.data.sectionB.PayorSecond),
                    pdf.radio(
                      'NHSO (National Health Security Office)',
                      this.data.sectionB.PayorSecond
                    )
                  )
                ]
              ]
            }
          }
        )
      ]
    ];
  }

  private sectionC(): pdfMake.Content[][] {
    // tslint:disable: variable-name
    const col1_1 = 180;
    const col1_2 = 30;
    const col1_3 = 30;
    const col2_1 = 180;
    const col2_2 = 30;
    const col2_3 = 30;
    const col3_1 = 230;
    const col3_2 = 30;
    const col3_3 = 30;
    // tslint:enable: variable-name

    return [
      [
        pdf.blockStyle({ style: 'section' }, pdf.section('C. HISTORY AND RISK FACTORS'), {
          text: ' (Known or Diagnosed Prior to First Cath Lab Visit)',
          bold: false
        })
      ],
      [
        pdf.stack(
          pdf.emptyLine(),
          pdf.columns(
            pdf.stack(
              pdf.columns(
                pdf.field('Hypertension', { annotation: '4615', width: col1_1 }),
                pdf.radio('No', this.data.sectionC.Hypertension, { width: col1_2 }),
                pdf.radio('Yes', this.data.sectionC.Hypertension, { width: col1_3 })
              ),
              pdf.columns(
                pdf.field('Diabetes Mellitus', { annotation: '4555', width: col1_1 }),
                pdf.radio('No', this.data.sectionC.Diabetes, { width: col1_2 }),
                pdf.radio('Yes', this.data.sectionC.Diabetes, { width: col1_3 })
              ),
              pdf.columns(
                pdf.field('Dyslipidemia', { annotation: '4620', width: col1_1 }),
                pdf.radio('No', this.data.sectionC.Dyslipidemia, { width: col1_2 }),
                pdf.radio('Yes', this.data.sectionC.Dyslipidemia, { width: col1_3 })
              ),
              pdf.columns(
                pdf.field('Prior MI', { annotation: '4291', width: col1_1 }),
                pdf.radio('No', this.data.sectionC.HxMI, { width: col1_2 }),
                pdf.radio('Yes', this.data.sectionC.HxMI, { width: col1_3 })
              ),
              pdf.block(
                pdf.tab(),
                pdf.arrowIf(),
                ' Yes, ',
                pdf.field('Most Recent MI Date', { annotation: '4296' }),
                pdf.date(this.data.sectionC.HxMIDate)
              ),
              pdf.columns(
                pdf.field('Prior PCI', { annotation: '4495', width: col1_1 }),
                pdf.radio('No', this.data.sectionC.PriorPCI, { width: col1_2 }),
                pdf.radio('Yes', this.data.sectionC.PriorPCI, { width: col1_3 })
              ),
              pdf.block(
                pdf.tab(),
                pdf.arrowIf(),
                ' Yes, ',
                pdf.field('Most Recent PCI Date', { annotation: '4503' }),
                pdf.date(this.data.sectionC.HxPCIDate)
              ),
              pdf.columns(
                pdf.blockStyle(
                  { width: col1_1 - 55 },
                  pdf.tab(),
                  pdf.arrowIf(),
                  ' Yes, ',
                  pdf.field('Left Main PCI', { annotation: '4501' })
                ),
                pdf.radio('Unknown', this.data.sectionC.LMPCI, { width: 55 }),
                pdf.radio('No', this.data.sectionC.LMPCI, { width: col1_2 }),
                pdf.radio('Yes', this.data.sectionC.LMPCI, { width: col1_3 })
              )
            ),
            pdf.stack(
              pdf.columns(
                pdf.block(
                  pdf.field('Height', { annotation: '6000' }),
                  pdf.input(this.data.sectionC.Height),
                  ' cm'
                ),
                pdf.block(
                  pdf.field('Weight', { annotation: '6005' }),
                  pdf.input(this.data.sectionC.Weight),
                  ' kg'
                )
              ),
              pdf.columns(
                pdf.field('Currently on Dialysis', { annotation: '4560', width: col2_1 }),
                pdf.radio('No', this.data.sectionC.CurrentDialysis, { width: col2_2 }),
                pdf.radio('Yes', this.data.sectionC.CurrentDialysis, { width: col2_3 })
              ),
              pdf.columns(
                pdf.field('Family Hx. of Premature CAD', { annotation: '4287', width: col2_1 }),
                pdf.radio('No', this.data.sectionC.FamilyHxCAD, { width: col2_2 }),
                pdf.radio('Yes', this.data.sectionC.FamilyHxCAD, { width: col2_3 })
              ),
              pdf.columns(
                pdf.field('Cerebrovascular Disease', { annotation: '4551', width: col2_1 }),
                pdf.radio('No', this.data.sectionC.HxCVD, { width: col2_2 }),
                pdf.radio('Yes', this.data.sectionC.HxCVD, { width: col2_3 })
              ),
              pdf.columns(
                pdf.field('Peipheral Arterial Disease', { annotation: '4610', width: col2_1 }),
                pdf.radio('No', this.data.sectionC.PriorPAD, { width: col2_2 }),
                pdf.radio('Yes', this.data.sectionC.PriorPAD, { width: col2_3 })
              ),
              pdf.columns(
                pdf.field('Chronic Lung Disease', { annotation: '4576', width: col2_1 }),
                pdf.radio('No', this.data.sectionC.HxChronicLungDisease, { width: col2_2 }),
                pdf.radio('Yes', this.data.sectionC.HxChronicLungDisease, { width: col2_3 })
              ),
              pdf.columns(
                pdf.field('Prior CABG', { annotation: '4515', width: col2_1 }),
                pdf.radio('No', this.data.sectionC.PriorCABG, { width: col2_2 }),
                pdf.radio('Yes', this.data.sectionC.PriorCABG, { width: col2_3 })
              ),
              pdf.block(
                pdf.tab(),
                pdf.arrowIf(),
                ' Yes, ',
                pdf.field('Most Recent CABG Date', { annotation: '4521' }),
                pdf.date(this.data.sectionC.HxCABGDate)
              )
            )
          )
        )
      ],
      [
        pdf.stack(
          pdf.emptyLine(),
          pdf.columns(
            pdf.field('Tobacco Use', { annotation: '4625', width: 85 }),
            pdf.stack(
              pdf.radio('Never', this.data.sectionC.TobaccoUse),
              pdf.radio('Current - Some Days', this.data.sectionC.TobaccoUse)
            ),
            pdf.stack(
              pdf.radio('Former', this.data.sectionC.TobaccoUse),
              pdf.radio('Current - Every Day', this.data.sectionC.TobaccoUse)
            ),
            pdf.stackStyle(
              { width: 200 },
              pdf.radio('Smoker, Current Status Unknown', this.data.sectionC.TobaccoUse),
              pdf.radio('Unknown if ever Smoked', this.data.sectionC.TobaccoUse)
            )
          ),
          pdf.block(
            pdf.tab(),
            pdf.arrowIf(),
            ' any Current, ',
            pdf.field('Tobacco Type', { annotation: '4626' }),
            '(Select all that apply)',
            pdf.tab(),
            pdf.check('Cigarettes', this.data.sectionC.TobaccoType),
            pdf.tab(),
            pdf.check('Cigars', this.data.sectionC.TobaccoType),
            pdf.tab(),
            pdf.check('Pipe', this.data.sectionC.TobaccoType),
            pdf.tab(),
            pdf.check('Smokeless', this.data.sectionC.TobaccoType)
          ),
          pdf.block(
            pdf.tab(),
            pdf.arrowIf(),
            ' Current - Every Day and Cigarettes, ',
            pdf.field('Amount', { annotation: '4627' }),
            pdf.tab(),
            pdf.radio('Light tobacco use (<10/day)', this.data.sectionC.SmokeAmount),
            pdf.tab(),
            pdf.radio('Heavy tobacco use (>=10/day)', this.data.sectionC.SmokeAmount)
          )
        )
      ],
      [
        pdf.stack(
          pdf.emptyLine(),
          pdf.columns(
            pdf.field('Cardiac Arrest Out of Healthcare Facility', {
              annotation: '4630',
              width: col3_1
            }),
            pdf.radio('No', this.data.sectionC.CAOutHospital, { width: col3_2 }),
            pdf.radio('Yes', this.data.sectionC.CAOutHospital, { width: col3_3 })
          ),
          pdf.columns(
            pdf.blockStyle(
              { width: col3_1 },
              pdf.tab(),
              pdf.arrowIf(),
              ' Yes, ',
              pdf.field('Arrest Witnessed', { annotation: '4631' })
            ),
            pdf.radio('No', this.data.sectionC.CAWitness, { width: col3_2 }),
            pdf.radio('Yes', this.data.sectionC.CAWitness, { width: col3_3 })
          ),
          pdf.columns(
            pdf.blockStyle(
              { width: col3_1 },
              pdf.tab(),
              pdf.arrowIf(),
              ' Yes, ',
              pdf.field('Arrest after Arrival of EMS', { annotation: '4632', width: col3_1 })
            ),
            pdf.radio('No', this.data.sectionC.CAPostEMS, { width: col3_2 }),
            pdf.radio('Yes', this.data.sectionC.CAPostEMS, { width: col3_3 })
          ),
          pdf.columns(
            pdf.blockStyle(
              { width: col3_1 },
              pdf.tab(),
              pdf.arrowIf(),
              ' Yes, ',
              pdf.field('First Cardiac Arrest Rhythm', { annotation: '4633', width: col3_1 })
            ),
            pdf.block(
              pdf.radio('Shockable', this.data.sectionC.InitCARhythm),
              pdf.tab(),
              pdf.radio('Not Shockable', this.data.sectionC.InitCARhythm),
              pdf.tab(),
              pdf.radio('Unknown', this.data.sectionC.InitCARhythm)
            )
          ),
          pdf.columns(
            pdf.field('Cardiac Arrest at Trasferring Healthcare Facility', {
              annotation: '4635',
              width: col3_1
            }),
            pdf.radio('No', this.data.sectionC.CATransferFac, { width: col3_2 }),
            pdf.radio('Yes', this.data.sectionC.CATransferFac, { width: col3_3 })
          )
        )
      ],
      [
        pdf.stack(
          pdf.emptyLine(),
          pdf.columns(
            pdf.field('CSHA Clinical Frailty Scale', { annotation: '4561' }),
            pdf.stack(
              pdf.radio('1: Very Fit', this.data.sectionC.CSHAScale),
              pdf.radio('2: Well', this.data.sectionC.CSHAScale),
              pdf.radio('3: Managing Well', this.data.sectionC.CSHAScale)
            ),
            pdf.stack(
              pdf.radio('4: Vulnerable', this.data.sectionC.CSHAScale),
              pdf.radio('5: Mildly Frail', this.data.sectionC.CSHAScale),
              pdf.radio('6: Moderately Frail', this.data.sectionC.CSHAScale)
            ),
            pdf.stack(
              pdf.radio('7: Severely Frail', this.data.sectionC.CSHAScale),
              pdf.radio('8: Very Severely Frail', this.data.sectionC.CSHAScale),
              pdf.radio('9: Terminally Ill', this.data.sectionC.CSHAScale)
            )
          )
        )
      ]
    ];
  }

  private sectionD(): pdfMake.Content[][] {
    return [
      [
        pdf.blockStyle(
          { style: 'section', pageBreak: 'before' },
          // { style: 'section' },
          pdf.section('D. PRE-PROCEDURE INFORMATION'),
          {
            text: ' (Complete for Each Cath Lab Visit)',
            bold: false
          }
        )
      ],
      [
        pdf.stack(
          pdf.emptyLine(),
          pdf.columns(
            pdf.stackStyle(
              { width: 170 },
              pdf.field('Heart Failure', { annotation: '4001' }),
              pdf.block(
                pdf.tab(),
                pdf.arrowIf(),
                ' Yes, ',
                pdf.field('NYHA Class', { annotation: '4011' })
              ),
              pdf.block(
                pdf.tab(),
                pdf.arrowIf(),
                ' Yes, ',
                pdf.field('Newly Diagnosed', { annotation: '4012' })
              ),
              pdf.block(
                pdf.tab(),
                pdf.arrowIf(),
                ' Yes, ',
                pdf.field('Heart Failure Type', { annotation: '4013' })
              )
            ),
            pdf.stack(
              pdf.block(
                pdf.radio('No', this.data.sectionD.HxHF),
                pdf.tab(2),
                pdf.radio('Yes', this.data.sectionD.HxHF)
              ),
              pdf.block(
                pdf.radio('Class I', this.data.sectionD.PriorNYHA),
                pdf.tab(2),
                pdf.radio('Class II', this.data.sectionD.PriorNYHA),
                pdf.tab(2),
                pdf.radio('Class III', this.data.sectionD.PriorNYHA),
                pdf.tab(2),
                pdf.radio('Class IV', this.data.sectionD.PriorNYHA)
              ),
              pdf.block(
                pdf.radio('No', this.data.sectionD.HFNewDiag),
                pdf.tab(2),
                pdf.radio('Yes', this.data.sectionD.HFNewDiag)
              ),
              pdf.block(
                pdf.radio('Diastolic', this.data.sectionD.HFType),
                pdf.tab(2),
                pdf.radio('Systolic', this.data.sectionD.HFType),
                pdf.tab(2),
                pdf.radio('Unknown', this.data.sectionD.HFType)
              )
            )
          )
        )
      ],
      [
        pdf.blockStyle(
          { style: 'section' },
          {
            text: '(DIAGNOSTIC TEST)',
            bold: false
          }
        )
      ],
      [
        pdf.stack(
          pdf.emptyLine(),
          pdf.block(
            pdf.field('Electrocardiac Assessment Method', { annotation: '5037' }),
            pdf.tab(),
            pdf.radio('ECG', this.data.sectionD.ECAssessMethod),
            pdf.tab(),
            pdf.radio('Telemetry Monitor', this.data.sectionD.ECAssessMethod),
            pdf.tab(),
            pdf.radio('Holter Monitor', this.data.sectionD.ECAssessMethod),
            pdf.tab(),
            pdf.radio('Other', this.data.sectionD.ECAssessMethod),
            pdf.tab(),
            pdf.radio('None', this.data.sectionD.ECAssessMethod)
          ),
          pdf.block(
            pdf.tab(),
            pdf.arrowIf(),
            ' any methods, ',
            pdf.field('Results', { annotation: '5032' }),
            pdf.tab(),
            pdf.radio('Normal', this.data.sectionD.ECGResults),
            pdf.tab(),
            pdf.radio('Abnormal', this.data.sectionD.ECGResults),
            pdf.tab(),
            pdf.radio('Uninterpretable', this.data.sectionD.ECGResults)
          ),
          pdf.block(
            pdf.tab(2),
            pdf.arrowIf(),
            ' Abnormal, ',
            pdf.field('New Antiarrhythmic Therapy Initiated Prior to Cath Lab', {
              annotation: '5033'
            }),
            pdf.tab(),
            pdf.radio('No', this.data.sectionD.AntiArrhyTherapy),
            pdf.tab(),
            pdf.radio('Yes', this.data.sectionD.AntiArrhyTherapy)
          ),
          pdf.block(
            pdf.tab(2),
            pdf.arrowIf(),
            ' Abnormal, ',
            pdf.field('Electrocardiac Abnormality Type', { annotation: '5034' }),
            '(Select all that apply)'
          ),
          pdf.columns(
            { text: '', width: 35 },
            pdf.stack(
              pdf.check('Ventricular Fibrillation (VF)', this.data.sectionD.ECGFindings),
              pdf.check('Sustained VT', this.data.sectionD.ECGFindings),
              pdf.check('Non Sustained VT', this.data.sectionD.ECGFindings),
              pdf.check('Exercise Induced VT', this.data.sectionD.ECGFindings),
              pdf.check('T wave inversions', this.data.sectionD.ECGFindings),
              pdf.check('ST deviation >= 0.5 mm', this.data.sectionD.ECGFindings)
            ),
            pdf.stack(
              pdf.check('New Left Bundle Branch Block', this.data.sectionD.ECGFindings),
              pdf.check('New Onset Atrial Fib', this.data.sectionD.ECGFindings),
              pdf.check('New Onset Atrial Flutter', this.data.sectionD.ECGFindings),
              pdf.check('PVC – Frequent', this.data.sectionD.ECGFindings),
              pdf.check('PVC – Infrequent', this.data.sectionD.ECGFindings)
            ),
            pdf.stack(
              pdf.check('2nd Degree AV Heart Block Type 1', this.data.sectionD.ECGFindings),
              pdf.check('2nd Degree AV Heart Block Type 2', this.data.sectionD.ECGFindings),
              pdf.check('3rd Degree AV Heart Block', this.data.sectionD.ECGFindings),
              pdf.check('Symptomatic Bradyarrhythmia', this.data.sectionD.ECGFindings),
              pdf.check('Other Electrocardiac Abnormality', this.data.sectionD.ECGFindings)
            )
          ),
          pdf.block(
            pdf.tab(3),
            pdf.arrowIf(),
            ' New Onset Atrial Fib, ',
            pdf.field('Heart Rate', { annotation: '6011' }),
            pdf.input(this.data.sectionD.HR),
            ' bpm'
          ),
          pdf.block(
            pdf.tab(3),
            pdf.arrowIf(),
            ' Non Sustained VT, ',
            pdf.field('Type', { annotation: '5036' }),
            '(Select all that apply)',
            pdf.tab(),
            pdf.check('Symptomatic', this.data.sectionD.NSVTType),
            pdf.tab(),
            pdf.check('Newly Diagnosed', this.data.sectionD.NSVTType),
            pdf.tab(),
            pdf.check('Other', this.data.sectionD.NSVTType)
          ),
          pdf.line(),
          pdf.emptyLine(),
          pdf.block(
            pdf.field('Stress Test Performed', { annotation: '5200' }),
            pdf.tab(),
            pdf.radio('No', this.data.sectionD.StressPerformed),
            pdf.tab(),
            pdf.radio('Yes', this.data.sectionD.StressPerformed)
          ),
          pdf.columns(
            { text: '', width: 9 },
            pdf.blockStyle(
              { width: 150 },
              pdf.arrowIf(),
              ' Yes, ',
              pdf.field('Test Type Performed', { annotation: '5201' })
            ),
            pdf.stackStyle(
              { width: 120 },
              pdf.radio('Stress Echocardiogram', this.data.sectionD.StressTestType),
              pdf.radio('Stress Nuclear', this.data.sectionD.StressTestType)
            ),
            pdf.stack(
              pdf.radio('Exercise Stress Test (w/o imaging)', this.data.sectionD.StressTestType),
              pdf.radio('Stress Imaging w/CMR', this.data.sectionD.StressTestType)
            )
          ),
          pdf.block(
            pdf.tab(),
            pdf.arrowIf(),
            ' Yes, ',
            pdf.field('Most Recent Date', { annotation: '5204' }),
            pdf.date(this.data.sectionD.StressTestDate)
          ),
          pdf.block(
            pdf.tab(),
            pdf.arrowIf(),
            ' Yes, ',
            pdf.field('Test Result', { annotation: '5202' }),
            pdf.tab(),
            pdf.radio('Negative', this.data.sectionD.StressTestResult),
            pdf.tab(),
            pdf.radio('Positive', this.data.sectionD.StressTestResult),
            pdf.tab(),
            pdf.radio('Indeterminate', this.data.sectionD.StressTestResult),
            pdf.tab(),
            pdf.radio('Unavailable', this.data.sectionD.StressTestResult)
          ),
          pdf.block(
            pdf.tab(2),
            pdf.arrowIf(),
            ' Positive, ',
            pdf.field('Risk/Extent of Ischemia', { annotation: '5203' }),
            pdf.radio('Low', this.data.sectionD.StressTestRisk),
            pdf.radio('Intermediate', this.data.sectionD.StressTestRisk),
            pdf.radio('High', this.data.sectionD.StressTestRisk),
            pdf.radio('Unavailable', this.data.sectionD.StressTestRisk)
          ),
          pdf.line(),
          pdf.emptyLine(),
          pdf.block(
            pdf.field('Cardiac CTA Performed', { annotation: '5220' }),
            pdf.tab(),
            pdf.radio('No', this.data.sectionD.CardiacCTA),
            pdf.tab(),
            pdf.radio('Yes', this.data.sectionD.CardiacCTA)
          ),
          pdf.block(
            pdf.tab(),
            pdf.arrowIf(),
            ' Yes, ',
            pdf.field('Most Recent Cardiac CTA Date'),
            pdf.date(this.data.sectionD.CardiacCTADate)
          ),
          pdf.columns(
            { text: '', width: 9 },
            pdf.blockStyle(
              { width: 100 },
              pdf.arrowIf(),
              ' Yes, ',
              pdf.field('Results', { annotation: '5227' })
            ),
            pdf.stackStyle(
              { width: 120 },
              pdf.radio('Obstructive CAD', this.data.sectionD.CardiacCTAResults),
              pdf.radio('Non-Obstructive CAD', this.data.sectionD.CardiacCTAResults)
            ),
            pdf.stackStyle(
              { width: 120 },
              pdf.radio('Unclear Severity', this.data.sectionD.CardiacCTAResults),
              pdf.radio('No CAD', this.data.sectionD.CardiacCTAResults)
            ),
            pdf.stack(
              pdf.radio('Structural Disease', this.data.sectionD.CardiacCTAResults),
              pdf.radio('Unknown', this.data.sectionD.CardiacCTAResults)
            )
          ),
          pdf.line(),
          pdf.emptyLine(),
          pdf.block(
            pdf.field('Agatston Coronary Calcium Score Assessed', { annotation: '5256' }),
            pdf.tab(),
            pdf.radio('No', this.data.sectionD.CalciumScoreAssessed),
            pdf.tab(),
            pdf.radio('Yes', this.data.sectionD.CalciumScoreAssessed)
          ),
          pdf.block(
            pdf.tab(),
            pdf.arrowIf(),
            ' Yes, ',
            pdf.field('Agatston Coronary Calcium Score', { annotation: '5255' }),
            pdf.input(this.data.sectionD.CalciumScore)
          ),
          pdf.block(
            pdf.tab(2),
            pdf.arrowIf(),
            ' any value, ',
            pdf.field('Most Recent Calcium Score Date', { annotation: '5257' }),
            pdf.date(this.data.sectionD.CalciumScoreDate)
          ),
          pdf.line(),
          pdf.emptyLine(),
          pdf.block(
            pdf.field('LVEF Assessed', { annotation: '5111' }),
            pdf.tab(),
            pdf.radio('No', this.data.sectionD.PreProcLVEFAssessed),
            pdf.tab(),
            pdf.radio('Yes', this.data.sectionD.PreProcLVEFAssessed)
          ),
          pdf.block(
            pdf.tab(),
            pdf.arrowIf(),
            ' Yes, ',
            pdf.field('Most Recent LVEF', { annotation: '5116' }),
            pdf.input(this.data.sectionD.PreProcLVEF)
          ),
          pdf.line(),
          pdf.emptyLine(),
          pdf.block(
            pdf.field('Prior Dx Coronary Angiography Procedure', { annotation: '5263' }),
            pdf.tab(),
            pdf.radio('No', this.data.sectionD.PriorDxAngioProc),
            pdf.tab(),
            pdf.radio('Yes', this.data.sectionD.PriorDxAngioProc)
          ),
          pdf.block(
            pdf.tab(),
            pdf.arrowIf(),
            ' Yes, ',
            pdf.field('Most Recent Procedure Date', { annotation: '5264' }),
            pdf.date(this.data.sectionD.PriorDxAngioDate)
          ),
          pdf.columns(
            { text: '', width: 9 },
            pdf.blockStyle(
              { width: 100 },
              pdf.arrowIf(),
              ' Yes, ',
              pdf.field('Results', { annotation: '5265' })
            ),
            pdf.stackStyle(
              { width: 120 },
              pdf.radio('Obstructive CAD', this.data.sectionD.PriorDxAngioResults),
              pdf.radio('Non-Obstructive CAD', this.data.sectionD.PriorDxAngioResults)
            ),
            pdf.stackStyle(
              { width: 120 },
              pdf.radio('Unclear Severity', this.data.sectionD.PriorDxAngioResults),
              pdf.radio('No CAD', this.data.sectionD.PriorDxAngioResults)
            ),
            pdf.stack(
              pdf.radio('Structural Disease', this.data.sectionD.PriorDxAngioResults),
              pdf.radio('Unknown', this.data.sectionD.PriorDxAngioResults)
            )
          )
        )
      ],
      [
        pdf.blockStyle(
          { style: 'section' },
          {
            text: 'PRE-PROCEDURE MEDICATIONS',
            bold: false
          }
        )
      ],
      [
        pdf.stack(
          pdf.emptyLine(),
          pdf.columns(
            pdf.field('Antiplatelet ASA', { width: 130 }),
            pdf.block(
              pdf.radio('No', this.data.sectionD.PreProcMedASA),
              pdf.tab(),
              pdf.radio('Yes', this.data.sectionD.PreProcMedASA),
              pdf.tab(),
              pdf.radio('Contraindicated', this.data.sectionD.PreProcMedASA)
            ),
            pdf.field('Ranolazine', { width: 85 }),
            pdf.block(
              pdf.radio('No', this.data.sectionD.PreProcMedRanolazine),
              pdf.tab(),
              pdf.radio('Yes', this.data.sectionD.PreProcMedRanolazine),
              pdf.tab(),
              pdf.radio('Contraindicated', this.data.sectionD.PreProcMedRanolazine)
            )
          ),
          pdf.columns(
            pdf.field('Beta Blockers (Any)', { width: 130 }),
            pdf.block(
              pdf.radio('No', this.data.sectionD.PreProcMedBetaBlocker),
              pdf.tab(),
              pdf.radio('Yes', this.data.sectionD.PreProcMedBetaBlocker),
              pdf.tab(),
              pdf.radio('Contraindicated', this.data.sectionD.PreProcMedBetaBlocker)
            ),
            pdf.field('Statin (Any)', { width: 85 }),
            pdf.block(
              pdf.radio('No', this.data.sectionD.PreProcMedStatin),
              pdf.tab(),
              pdf.radio('Yes', this.data.sectionD.PreProcMedStatin),
              pdf.tab(),
              pdf.radio('Contraindicated', this.data.sectionD.PreProcMedStatin)
            )
          ),
          pdf.columns(
            pdf.field('Ca Channel Blockers (Any)', { width: 130 }),
            pdf.block(
              pdf.radio('No', this.data.sectionD.PreProcMedCaBlocker),
              pdf.tab(),
              pdf.radio('Yes', this.data.sectionD.PreProcMedCaBlocker),
              pdf.tab(),
              pdf.radio('Contraindicated', this.data.sectionD.PreProcMedCaBlocker)
            ),
            pdf.field('Non-Statin (Any)', { width: 85 }),
            pdf.block(
              pdf.radio('No', this.data.sectionD.PreProcMedNonStatin),
              pdf.tab(),
              pdf.radio('Yes', this.data.sectionD.PreProcMedNonStatin),
              pdf.tab(),
              pdf.radio('Contraindicated', this.data.sectionD.PreProcMedNonStatin)
            )
          ),
          pdf.columns(
            pdf.field('Antiarrhythmic Agent Other', { width: 130 }),
            pdf.block(
              pdf.radio('No', this.data.sectionD.PreProcMedAntiArrhythmic),
              pdf.tab(),
              pdf.radio('Yes', this.data.sectionD.PreProcMedAntiArrhythmic),
              pdf.tab(),
              pdf.radio('Contraindicated', this.data.sectionD.PreProcMedAntiArrhythmic)
            ),
            pdf.field('PCSK9 Inhibitors', { width: 85 }),
            pdf.block(
              pdf.radio('No', this.data.sectionD.PreProcMedPCSK9),
              pdf.tab(),
              pdf.radio('Yes', this.data.sectionD.PreProcMedPCSK9),
              pdf.tab(),
              pdf.radio('Contraindicated', this.data.sectionD.PreProcMedPCSK9)
            )
          ),
          pdf.columns(
            pdf.field('Long Acting Nitrates (Any)', { width: 130 }),
            pdf.block(
              pdf.radio('No', this.data.sectionD.PreProcMedLongActNitrate),
              pdf.tab(),
              pdf.radio('Yes', this.data.sectionD.PreProcMedLongActNitrate),
              pdf.tab(),
              pdf.radio('Contraindicated', this.data.sectionD.PreProcMedLongActNitrate)
            )
          )
        )
      ]
    ];
  }

  private sectionE(): pdfMake.Content[][] {
    return [
      [
        pdf.blockStyle(
          // { style: 'section', pageBreak: 'before' },
          // { style: 'section' },
          pdf.section('E. PROCEDURE INFORMATION')
        )
      ],
      [
        pdf.stack(
          pdf.emptyLine(),
          pdf.columns(
            pdf.block(
              pdf.field('Procedure Start Date/Time', { annotation: '7000' }),
              pdf.date(this.data.sectionE.ProcedureStartDateTime, 'datetime')
            ),
            pdf.block(
              pdf.field('Procedure End Date/Time', { annotation: '7005' }),
              pdf.date(this.data.sectionE.ProcedureEndDateTime, 'datetime')
            )
          ),
          pdf.block(
            pdf.field('Diagnostic Coronary Angiography Procedure', { annotation: '7045' }),
            pdf.tab(),
            pdf.radio('No', this.data.sectionE.DiagCorAngio),
            pdf.tab(),
            pdf.radio('Yes', this.data.sectionE.DiagCorAngio)
          ),
          pdf.block(
            pdf.tab(),
            pdf.arrowIf(),
            ' Yes, ',
            pdf.field('Diagnostic Cath Operator', { annotation: '7046,7047' }),
            pdf.input(this.data.sectionE.DCathProvider)
          ),
          pdf.block(
            pdf.field('Percutaneous Coronary Intervention (PCI)', { annotation: '7050' }),
            pdf.tab(),
            pdf.radio('No', this.data.sectionE.PCIProc),
            pdf.tab(),
            pdf.radio('Yes', this.data.sectionE.PCIProc)
          ),
          pdf.block(
            pdf.tab(),
            pdf.arrowIf(),
            ' Yes, ',
            pdf.field('PCI Operator', { annotation: '7051,7052' }),
            pdf.input(this.data.sectionE.PCIProvider)
          ),
          pdf.block(
            pdf.field('Diagnostic Left Heart Cath', { annotation: '7060' }),
            pdf.tab(),
            pdf.radio('No', this.data.sectionE.LeftHeartCath),
            pdf.tab(),
            pdf.radio('Yes', this.data.sectionE.LeftHeartCath)
          ),
          pdf.block(
            pdf.tab(),
            pdf.arrowIf(),
            ' Yes, ',
            pdf.field('LVEF', { annotation: '7061' }),
            pdf.input(this.data.sectionE.PrePCILVEF),
            ' %',
            pdf.tab(),
            pdf.field('LVEDP', { annotation: '7061' }),
            pdf.input(this.data.sectionE.PrePCILVEDP),
            ' mmHg'
          ),
          pdf.line(),
          pdf.emptyLine(),
          pdf.block(
            pdf.field('Concomitant Procedures Performed', { annotation: '7065' }),
            pdf.tab(),
            pdf.radio('No', this.data.sectionE.ConcomProc),
            pdf.tab(),
            pdf.radio('Yes', this.data.sectionE.ConcomProc)
          ),
          pdf.block(
            pdf.tab(),
            pdf.arrowIf(),
            ' Yes, ',
            pdf.field('Procedure Type(s)', { annotation: '7066' }),
            '(Select the best option(s))'
          ),
          pdf.columns(
            { text: '', width: 26 },
            pdf.stackStyle(
              { width: 205 },
              pdf.check('Structural Repair', this.data.sectionE.ConcomProcType),
              pdf.check('Left Atrial Appendage Occlusion', this.data.sectionE.ConcomProcType),
              pdf.check('Parachute Device Placement', this.data.sectionE.ConcomProcType),
              pdf.check('Mitral Clip Procedure', this.data.sectionE.ConcomProcType),
              pdf.check(
                'Transcatheter Aortic Valve Replacement (TAVR)',
                this.data.sectionE.ConcomProcType
              ),
              pdf.check(
                'Thoracic Endovascular Aortic Repair (TEVAR)',
                this.data.sectionE.ConcomProcType
              ),
              pdf.check('Endovascular Aortic Repair (EVAR)', this.data.sectionE.ConcomProcType)
            ),
            pdf.stack(
              pdf.check('Right Heart Cath', this.data.sectionE.ConcomProcType),
              pdf.check('EP Study', this.data.sectionE.ConcomProcType),
              pdf.check('Cardioversion', this.data.sectionE.ConcomProcType),
              pdf.check('Temporary Pacemaker Placement', this.data.sectionE.ConcomProcType),
              pdf.check('Permanent Pacemaker Placement', this.data.sectionE.ConcomProcType),
              pdf.check('LIMA (Native Position) Angiography', this.data.sectionE.ConcomProcType)
            ),
            pdf.stackStyle(
              { width: 'auto' },
              pdf.check('Aortography', this.data.sectionE.ConcomProcType),
              pdf.check('Renal Angiography', this.data.sectionE.ConcomProcType),
              pdf.check('Peripheral Intervention', this.data.sectionE.ConcomProcType),
              pdf.check('Peripheral Angiography', this.data.sectionE.ConcomProcType),
              pdf.check('Biopsy of heart', this.data.sectionE.ConcomProcType),
              pdf.check('Procedure Type Not Listed', this.data.sectionE.ConcomProcType)
            )
          ),
          pdf.line(),
          pdf.emptyLine(),
          pdf.columns(
            pdf.field('Arterial Access Site', { annotation: '7320' }),
            pdf.stack(
              pdf.radio('Right Femoral', this.data.sectionE.AccessSite),
              pdf.radio('Left Femoral', this.data.sectionE.AccessSite)
            ),
            pdf.stack(
              pdf.radio('Right Brachial', this.data.sectionE.AccessSite),
              pdf.radio('Left Brachial', this.data.sectionE.AccessSite)
            ),
            pdf.stack(
              pdf.radio('Right Radial', this.data.sectionE.AccessSite),
              pdf.radio('Left Radial', this.data.sectionE.AccessSite)
            ),
            pdf.radio('Other', this.data.sectionE.AccessSite, { width: 75 })
          ),
          pdf.columns(
            { text: '', width: 9 },
            pdf.field('Access Site - Closure Method', { width: 135 }),
            pdf.stackStyle(
              { width: 130 },
              pdf.radio('Manual Compression', this.data.sectionE.AccessSiteClosure),
              pdf.radio('Compression Device', this.data.sectionE.AccessSiteClosure)
            ),
            pdf.stack(
              pdf.radio('Sealing technique', this.data.sectionE.AccessSiteClosure),
              pdf.radio('Suturing technique', this.data.sectionE.AccessSiteClosure)
            )
          ),
          pdf.line(),
          pdf.emptyLine(),
          pdf.columns(
            pdf.field('Arterial Cross Over', { annotation: '7325' }),
            pdf.stack(
              pdf.radio('Right Femoral', this.data.sectionE.Crossover),
              pdf.radio('Left Femoral', this.data.sectionE.Crossover)
            ),
            pdf.stack(
              pdf.radio('Right Brachial', this.data.sectionE.Crossover),
              pdf.radio('Left Brachial', this.data.sectionE.Crossover)
            ),
            pdf.stack(
              pdf.radio('Right Radial', this.data.sectionE.Crossover),
              pdf.radio('Left Radial', this.data.sectionE.Crossover)
            ),
            pdf.radio('No', this.data.sectionE.Crossover, { width: 75 })
          ),
          pdf.columns(
            { text: '', width: 9 },
            pdf.blockStyle(
              { width: 185 },
              pdf.arrowIf(),
              ' not No, ',
              pdf.field('Cross Over - Closure Method')
            ),
            pdf.stackStyle(
              { width: 130 },
              pdf.radio('Manual Compression', this.data.sectionE.CrossoverClosure),
              pdf.radio('Compression Device', this.data.sectionE.CrossoverClosure)
            ),
            pdf.stack(
              pdf.radio('Sealing technique', this.data.sectionE.CrossoverClosure),
              pdf.radio('Suturing technique', this.data.sectionE.CrossoverClosure)
            )
          ),
          pdf.line(),
          pdf.emptyLine(),
          pdf.columns(
            pdf.field('Arterial Simultaneous'),
            pdf.stack(
              pdf.radio('Right Femoral', this.data.sectionE.Simultaneous),
              pdf.radio('Left Femoral', this.data.sectionE.Simultaneous)
            ),
            pdf.stack(
              pdf.radio('Right Brachial', this.data.sectionE.Simultaneous),
              pdf.radio('Left Brachial', this.data.sectionE.Simultaneous)
            ),
            pdf.stack(
              pdf.radio('Right Radial', this.data.sectionE.Simultaneous),
              pdf.radio('Left Radial', this.data.sectionE.Simultaneous)
            ),
            pdf.radio('No', this.data.sectionE.Simultaneous, { width: 75 })
          ),
          pdf.columns(
            { text: '', width: 9 },
            pdf.blockStyle(
              { width: 200 },
              pdf.arrowIf(),
              ' not No, ',
              pdf.field('Simultaneous - Closure Method')
            ),
            pdf.stackStyle(
              { width: 130 },
              pdf.radio('Manual Compression', this.data.sectionE.SimultaneousClosure),
              pdf.radio('Compression Device', this.data.sectionE.SimultaneousClosure)
            ),
            pdf.stack(
              pdf.radio('Sealing technique', this.data.sectionE.SimultaneousClosure),
              pdf.radio('Suturing technique', this.data.sectionE.SimultaneousClosure)
            )
          ),
          pdf.line(),
          pdf.emptyLine(),
          pdf.block(
            pdf.field('Venous Access', { annotation: '7335' }),
            pdf.tab(),
            pdf.radio('No', this.data.sectionE.VenousAccess),
            pdf.tab(),
            pdf.radio('Yes', this.data.sectionE.VenousAccess)
          ),
          pdf.columns(
            { text: '', width: 9 },
            pdf.blockStyle(
              { width: 175 },
              pdf.arrowIf(),
              ' not No, ',
              pdf.field('Venous - Closure Method')
            ),
            pdf.stackStyle(
              { width: 130 },
              pdf.radio('Manual Compression', this.data.sectionE.VenousAccessClosure),
              pdf.radio('Compression Device', this.data.sectionE.VenousAccessClosure)
            ),
            pdf.stack(
              pdf.radio('Sealing technique', this.data.sectionE.VenousAccessClosure),
              pdf.radio('Suturing technique', this.data.sectionE.VenousAccessClosure)
            )
          ),
          pdf.line(),
          pdf.emptyLine(),
          pdf.block(
            pdf.field('Systolic BP', { annotation: '6016' }),
            pdf.input(this.data.sectionE.ProcSystolicBP),
            ' mmHg'
          ),
          pdf.block(
            pdf.field('Cardiac Arrest at this facility', { annotation: '7340' }),
            pdf.radio('No', this.data.sectionE.CAInHosp),
            pdf.radio('Yes', this.data.sectionE.CAInHosp)
          )
        )
      ],
      [
        pdf.blockStyle(
          { style: 'section' },
          {
            text: 'RADIATION EXPOSURE AND CONTRAST',
            bold: false
          }
        )
      ],
      [
        pdf.stack(
          pdf.emptyLine(),
          pdf.columns(
            pdf.block(
              pdf.field('Fluoro Time', { annotation: '7214' }),
              pdf.input(this.data.sectionE.FluoroTime),
              ' miniutes'
            ),
            pdf.block(
              pdf.field('Contrast Volume', { annotation: '7215' }),
              pdf.input(this.data.sectionE.ContrastVol),
              ' ml'
            )
          ),
          pdf.columns(
            pdf.block(
              pdf.field('Cumulative Air Kerma', { annotation: '7210' }),
              pdf.input(this.data.sectionE.FluoroDoseKerm),
              ' mGy'
            ),
            pdf.block(
              pdf.field('Dose Area Product', { annotation: '7220' }),
              pdf.input(this.data.sectionE.FluoroDoseDAP),
              ' mGy/cm²'
            )
          )
        )
      ]
    ];
  }
  private sectionF(): pdfMake.Content[][] {
    const col1_1 = 100;
    const col1_2 = 170;
    const col1_3 = 100;
    const col1_4 = '*';
    return [
      [pdf.blockStyle(pdf.section('F. LABS'))],
      [
        pdf.stack(
          pdf.emptyLine(),
          pdf.columns(
            pdf.blockStyle(
              { alignment: 'center' },
              { text: 'PRE-PROCEDURE', bold: true },
              ' (value closest to the procedure)'
            ),
            { text: 'POST-PROCEDURE', bold: true, alignment: 'center' }
          ),
          pdf.columns(
            pdf.field('hsTroponin I', { annotation: '6090', width: col1_1 }),
            pdf.blockStyle(
              { width: col1_2 },
              pdf.radio('Drawn', this.data.sectionF.PreProcTnILab),
              ' ',
              pdf.input(this.data.sectionF.PreProcTnI),
              ' ng/mL'
            ),
            pdf.field('hsTroponin I', { annotation: '8526', width: col1_3 }),
            pdf.blockStyle(
              { width: col1_4 },
              pdf.radio('Drawn', this.data.sectionF.PostProcTnILab),
              ' ',
              pdf.input(this.data.sectionF.PostProcTnI),
              ' ng/mL'
            )
          ),
          pdf.columns(
            pdf.field('hsTroponin T', { annotation: '6095', width: col1_1 }),
            pdf.blockStyle(
              { width: col1_2 },
              pdf.radio('Drawn', this.data.sectionF.PreProcTnTLab),
              ' ',
              pdf.input(this.data.sectionF.PreProcTnT),
              ' ng/mL'
            ),
            pdf.field('hsTroponin T', { annotation: '8520', width: col1_3 }),
            pdf.blockStyle(
              { width: col1_4 },
              pdf.radio('Drawn', this.data.sectionF.PostProcTnTLab),
              ' ',
              pdf.input(this.data.sectionF.PostProcTnT),
              ' ng/mL'
            )
          ),
          pdf.columns(
            pdf.field('Creatinine', { annotation: '6050', width: col1_1 }),
            pdf.blockStyle(
              { width: col1_2 },
              pdf.radio('Drawn', this.data.sectionF.PreProcCreatLab),
              ' ',
              pdf.input(this.data.sectionF.PreProcCreat),
              ' ng/mL'
            ),
            pdf.field('Creatinine', { annotation: '8510', width: col1_3 }),
            pdf.blockStyle(
              { width: col1_4 },
              pdf.radio('Drawn', this.data.sectionF.PostProcCreatLab),
              ' ',
              pdf.input(this.data.sectionF.PostProcCreat),
              ' ng/mL'
            )
          ),
          pdf.columns(
            pdf.field('Hemoglobin', { annotation: '6030', width: col1_1 }),
            pdf.blockStyle(
              { width: col1_2 },
              pdf.radio('Drawn', this.data.sectionF.HGBLab),
              ' ',
              pdf.input(this.data.sectionF.HGB),
              ' g/dL'
            ),
            pdf.field('Hemoglobin', { annotation: '8505', width: col1_3 }),
            pdf.blockStyle(
              { width: col1_4 },
              pdf.radio('Drawn', this.data.sectionF.PostProcHgbLab),
              ' ',
              pdf.input(this.data.sectionF.PostProcHgb),
              ' g/dL'
            )
          ),
          pdf.columns(
            pdf.field('Total Cholesterol', { annotation: '6100', width: col1_1 }),
            pdf.block(
              pdf.radio('Drawn', this.data.sectionF.LipidsTCLab),
              ' ',
              pdf.input(this.data.sectionF.LipidsTC),
              ' mg/dL'
            )
          ),
          pdf.columns(
            pdf.field('HDL', { annotation: '6105', width: col1_1 }),
            pdf.block(
              pdf.radio('Drawn', this.data.sectionF.LipidsHDLLab),
              ' ',
              pdf.input(this.data.sectionF.LipidsHDL),
              ' mg/dL'
            )
          )
        )
      ]
    ];
  }
}