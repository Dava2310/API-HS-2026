/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { MigrationInterface, QueryRunner } from 'typeorm';

interface AssetConfig {
  categoryCode: string;
  skuPrefix: string; // 3 uppercase letters, unique per category
  items: Array<[brand: string, model: string]>; // exactly 10 per category
}

/**
 * 50 categories × 10 assets each = 500 assets total.
 * Assets 0-5  (per category): assigned to an employee (300 assigned).
 * Assets 6-9  (per category): no employee assigned   (200 unassigned).
 *
 * SKU format: {PREFIX}-{001..010}  (max 7 chars — well within the 20-char limit).
 */
const assetConfigs: AssetConfig[] = [
  {
    categoryCode: 'LAPTOP',
    skuPrefix: 'LPT',
    items: [
      ['Dell', 'Latitude 7420'],
      ['HP', 'EliteBook 840 G8'],
      ['Lenovo', 'ThinkPad X1 Carbon'],
      ['Apple', 'MacBook Pro 14'],
      ['Asus', 'ZenBook 14'],
      ['Dell', 'Latitude 5520'],
      ['HP', 'ProBook 450 G8'],
      ['Lenovo', 'IdeaPad 5 Pro'],
      ['Microsoft', 'Surface Laptop 4'],
      ['Acer', 'Swift 3'],
    ],
  },
  {
    categoryCode: 'DESKTOP',
    skuPrefix: 'DTP',
    items: [
      ['Dell', 'OptiPlex 7090'],
      ['HP', 'ProDesk 600 G6'],
      ['Lenovo', 'ThinkCentre M90s'],
      ['Apple', 'Mac Mini M1'],
      ['Acer', 'Veriton X4680G'],
      ['Dell', 'OptiPlex 3090'],
      ['HP', 'EliteDesk 800 G8'],
      ['Lenovo', 'ThinkStation P340'],
      ['Asus', 'Pro E500 G6'],
      ['MSI', 'Pro DP21 11M'],
    ],
  },
  {
    categoryCode: 'MONITOR',
    skuPrefix: 'MON',
    items: [
      ['Dell', 'UltraSharp U2722D'],
      ['Samsung', 'Odyssey G5 27'],
      ['LG', '27UK850-W'],
      ['HP', 'EliteDisplay E243'],
      ['BenQ', 'EW2480'],
      ['Dell', 'S2721QS'],
      ['AOC', 'U2790PQU'],
      ['ViewSonic', 'VP2768'],
      ['Asus', 'ProArt PA278QV'],
      ['NEC', 'MultiSync EA271F'],
    ],
  },
  {
    categoryCode: 'KEYBOARD',
    skuPrefix: 'KBD',
    items: [
      ['Logitech', 'MX Keys'],
      ['Microsoft', 'Ergonomic Keyboard'],
      ['Dell', 'KB216'],
      ['HP', 'SK2885'],
      ['Lenovo', 'Pro Wireless'],
      ['Logitech', 'K380'],
      ['Microsoft', 'Arc Keyboard'],
      ['Apple', 'Magic Keyboard'],
      ['Corsair', 'K70 RGB'],
      ['Razer', 'BlackWidow V3'],
    ],
  },
  {
    categoryCode: 'MOUSE',
    skuPrefix: 'MOU',
    items: [
      ['Logitech', 'MX Master 3'],
      ['Microsoft', 'Arc Mouse'],
      ['Dell', 'MS3320W'],
      ['HP', 'Z3700'],
      ['Logitech', 'M720 Triathlon'],
      ['Apple', 'Magic Mouse 2'],
      ['Lenovo', 'Go USB-C'],
      ['Microsoft', 'Modern Mobile'],
      ['Razer', 'DeathAdder V2'],
      ['SteelSeries', 'Rival 3'],
    ],
  },
  {
    categoryCode: 'PRINTER',
    skuPrefix: 'PRT',
    items: [
      ['HP', 'LaserJet Pro M404'],
      ['Canon', 'PIXMA TS9120'],
      ['Epson', 'EcoTank L3150'],
      ['Brother', 'MFC-J995DW'],
      ['HP', 'OfficeJet Pro 9015'],
      ['Canon', 'imageCLASS MF445dw'],
      ['Epson', 'WorkForce Pro WF-4830'],
      ['Brother', 'HL-L3290CDW'],
      ['HP', 'Color LaserJet Pro'],
      ['Lexmark', 'MB2650adwe'],
    ],
  },
  {
    categoryCode: 'SCANNER',
    skuPrefix: 'SCN',
    items: [
      ['Epson', 'WorkForce DS-530'],
      ['Canon', 'DR-C225II'],
      ['Fujitsu', 'ScanSnap iX1600'],
      ['HP', 'ScanJet Pro 3600'],
      ['Brother', 'ADS-2700W'],
      ['Epson', 'Perfection V39'],
      ['Canon', 'imageFORMULA R40'],
      ['Kodak', 'ScanMate i1150'],
      ['Fujitsu', 'fi-7160'],
      ['Panasonic', 'KV-S1037'],
    ],
  },
  {
    categoryCode: 'WEBCAM',
    skuPrefix: 'WBC',
    items: [
      ['Logitech', 'C920 HD Pro'],
      ['Microsoft', 'LifeCam HD-3000'],
      ['Razer', 'Kiyo Pro'],
      ['Logitech', 'BRIO 4K'],
      ['Microsoft', 'Modern Webcam'],
      ['Poly', 'Studio P5'],
      ['Jabra', 'PanaCast 20'],
      ['Logitech', 'C310'],
      ['Creative', 'Live! Cam Sync 4K'],
      ['Anker', 'PowerConf C300'],
    ],
  },
  {
    categoryCode: 'PHONE',
    skuPrefix: 'PHN',
    items: [
      ['Apple', 'iPhone 14 Pro'],
      ['Samsung', 'Galaxy S23'],
      ['Google', 'Pixel 7'],
      ['Sony', 'Xperia 5 IV'],
      ['OnePlus', '11'],
      ['Apple', 'iPhone 13'],
      ['Samsung', 'Galaxy A53'],
      ['Motorola', 'Edge 30'],
      ['Nokia', 'X30'],
      ['Huawei', 'P50 Pro'],
    ],
  },
  {
    categoryCode: 'TABLET',
    skuPrefix: 'TAB',
    items: [
      ['Apple', 'iPad Pro 12.9'],
      ['Samsung', 'Galaxy Tab S8'],
      ['Microsoft', 'Surface Pro 9'],
      ['Lenovo', 'Tab P12 Pro'],
      ['Amazon', 'Fire HD 10'],
      ['Apple', 'iPad Air 5'],
      ['Samsung', 'Galaxy Tab A8'],
      ['Lenovo', 'IdeaPad Duet 5'],
      ['Asus', 'Zenpad 10'],
      ['Huawei', 'MatePad Pro'],
    ],
  },
  {
    categoryCode: 'SERVER',
    skuPrefix: 'SRV',
    items: [
      ['Dell', 'PowerEdge R750'],
      ['HP', 'ProLiant DL380 Gen10'],
      ['Lenovo', 'ThinkSystem SR650'],
      ['IBM', 'Power S1014'],
      ['Cisco', 'UCS C220 M6'],
      ['Dell', 'PowerEdge T550'],
      ['HP', 'ProLiant ML350'],
      ['Fujitsu', 'PRIMERGY RX2540'],
      ['Supermicro', 'SYS-620P'],
      ['Intel', 'Server System M50CYP2'],
    ],
  },
  {
    categoryCode: 'ROUTER',
    skuPrefix: 'ROU',
    items: [
      ['Cisco', 'ISR 4321'],
      ['Juniper', 'SRX345'],
      ['Netgear', 'Nighthawk X6S'],
      ['Asus', 'RT-AX88U'],
      ['TP-Link', 'Archer AX6000'],
      ['Cisco', 'RV340'],
      ['Ubiquiti', 'Dream Machine Pro'],
      ['Mikrotik', 'CCR2004'],
      ['D-Link', 'DIR-X5460'],
      ['Linksys', 'MR9600'],
    ],
  },
  {
    categoryCode: 'SWITCH',
    skuPrefix: 'SWT',
    items: [
      ['Cisco', 'Catalyst 2960-X'],
      ['Juniper', 'EX3400'],
      ['HP', 'Aruba 2930F'],
      ['Netgear', 'GS724T'],
      ['TP-Link', 'TL-SG3428'],
      ['Dell', 'PowerSwitch N1548'],
      ['Cisco', 'SG550X'],
      ['Ubiquiti', 'UniFi USW-48'],
      ['Zyxel', 'XGS1930'],
      ['D-Link', 'DGS-1210-48'],
    ],
  },
  {
    categoryCode: 'FIREWALL',
    skuPrefix: 'FWL',
    items: [
      ['Cisco', 'Firepower 1120'],
      ['Palo Alto', 'PA-220'],
      ['Fortinet', 'FortiGate 60F'],
      ['SonicWall', 'TZ400'],
      ['Check Point', '1530 Appliance'],
      ['Cisco', 'ASA 5506-X'],
      ['Juniper', 'SRX300'],
      ['Sophos', 'XG 115'],
      ['WatchGuard', 'Firebox M270'],
      ['Netgate', 'SG-3100'],
    ],
  },
  {
    categoryCode: 'NAS',
    skuPrefix: 'NAS',
    items: [
      ['Synology', 'DS923+'],
      ['QNAP', 'TS-464'],
      ['WD', 'PR4100'],
      ['Synology', 'DS720+'],
      ['QNAP', 'TS-253D'],
      ['Asustor', 'AS6704T'],
      ['TerraMaster', 'F4-423'],
      ['Synology', 'RS1221+'],
      ['QNAP', 'TVS-h674'],
      ['Buffalo', 'TeraStation 3410'],
    ],
  },
  {
    categoryCode: 'UPS',
    skuPrefix: 'UPS',
    items: [
      ['APC', 'Smart-UPS 1500'],
      ['CyberPower', 'PR1500LCDRT2U'],
      ['Eaton', '5P1550'],
      ['Tripp Lite', 'SMART1500LCD'],
      ['Vertiv', 'Liebert GXT5'],
      ['APC', 'Back-UPS Pro 1500'],
      ['CyberPower', 'CP1500PFCLCD'],
      ['Eaton', '9PX2000'],
      ['APC', 'Smart-UPS 3000'],
      ['Tripp Lite', 'SUINT3000RTXL2U'],
    ],
  },
  {
    categoryCode: 'PROJECTOR',
    skuPrefix: 'PRJ',
    items: [
      ['Epson', 'EB-2265U'],
      ['BenQ', 'MH535FHD'],
      ['Sony', 'VPL-FHZ57'],
      ['NEC', 'PA803UL'],
      ['Optoma', 'EH412'],
      ['Panasonic', 'PT-MZ670'],
      ['Christie', 'Boxer 2K20'],
      ['Barco', 'ClickShare CSE-200'],
      ['BenQ', 'LU950'],
      ['Casio', 'XJ-V2'],
    ],
  },
  {
    categoryCode: 'HEADSET',
    skuPrefix: 'HDS',
    items: [
      ['Jabra', 'Evolve2 85'],
      ['Poly', 'Voyager Focus 2'],
      ['Logitech', 'H650e'],
      ['Sony', 'WH-1000XM5'],
      ['Sennheiser', 'MB 660'],
      ['Jabra', 'Evolve2 65'],
      ['Poly', 'Voyager 4320'],
      ['Logitech', 'Zone Wireless'],
      ['Microsoft', 'Surface Headphones 2'],
      ['Plantronics', 'CS540'],
    ],
  },
  {
    categoryCode: 'DESKPHONE',
    skuPrefix: 'DPH',
    items: [
      ['Cisco', 'IP Phone 8841'],
      ['Poly', 'VVX 601'],
      ['Yealink', 'T57W'],
      ['Avaya', 'J159 IP Phone'],
      ['Grandstream', 'GXP2170'],
      ['Cisco', 'IP Phone 8861'],
      ['Poly', 'VVX 450'],
      ['Yealink', 'T53W'],
      ['Snom', 'D785'],
      ['Fanvil', 'X5U'],
    ],
  },
  {
    categoryCode: 'CABLE',
    skuPrefix: 'CBL',
    items: [
      ['Belkin', 'RJ45 Cat6 5m'],
      ['APC', 'AP9878 Power Cable'],
      ['Tripp Lite', 'N001-015-GY'],
      ['Monoprice', 'HDMI 2.0 6ft'],
      ['Cable Matters', 'USB-C 10ft'],
      ['Belkin', 'Thunderbolt 3 Cable'],
      ['Amazon Basics', 'Cat7 25ft'],
      ['StarTech', 'SVGAMM050'],
      ['Ugreen', 'USB Extension 5m'],
      ['BENFEI', 'DP to HDMI 6ft'],
    ],
  },
  {
    categoryCode: 'ADAPTER',
    skuPrefix: 'ADP',
    items: [
      ['Apple', 'USB-C Digital AV'],
      ['Anker', 'PowerExpand 7-in-1'],
      ['Belkin', 'USB-C 3.1 Hub'],
      ['StarTech', 'US1GC30SFP'],
      ['j5create', 'JCA374'],
      ['Plugable', 'UD-3900'],
      ['CalDigit', 'TS3 Plus'],
      ['Corsair', 'TBT100'],
      ['Sabrent', 'USB 3.0 Hub'],
      ['Hyper', 'HyperDrive Slim 8-in-1'],
    ],
  },
  {
    categoryCode: 'CHARGER',
    skuPrefix: 'CHG',
    items: [
      ['Apple', '61W USB-C Adapter'],
      ['Anker', 'PowerPort III 65W'],
      ['Belkin', 'Boost Charge Pro'],
      ['Mophie', 'Powerstation Hub'],
      ['Samsung', '45W PD Charger'],
      ['Apple', '20W USB-C Power'],
      ['Anker', '736 Nano II 100W'],
      ['RavPower', '90W PD Charger'],
      ['AUKEY', 'Swift 60W'],
      ['Baseus', '65W PD Charger'],
    ],
  },
  {
    categoryCode: 'BATTERY',
    skuPrefix: 'BAT',
    items: [
      ['Anker', 'PowerCore 20000'],
      ['RavPower', 'PD Pioneer 20000'],
      ['Mophie', 'Powerstation XL'],
      ['Belkin', 'BPB001'],
      ['Xiaomi', 'Mi Power Bank 3'],
      ['Anker', 'PowerCore Slim 10000'],
      ['Samsung', 'Battery Pack 10000'],
      ['INIU', 'Power Bank 20000'],
      ['Baseus', '65W Power Bank'],
      ['Omni', 'Mobile 25600'],
    ],
  },
  {
    categoryCode: 'TONER',
    skuPrefix: 'TNR',
    items: [
      ['HP', 'CF258X Black'],
      ['Canon', 'CRG-057H'],
      ['Brother', 'TN760'],
      ['Xerox', '006R03823'],
      ['Lexmark', '60F1000'],
      ['HP', 'CF294X'],
      ['Brother', 'TN-910BK'],
      ['Canon', '046H'],
      ['Konica', 'TNP49K'],
      ['Ricoh', '841996'],
    ],
  },
  {
    categoryCode: 'PAPER',
    skuPrefix: 'PPR',
    items: [
      ['HP', 'Office20 A4 500s'],
      ['Canon', 'SB-A420'],
      ['Hammermill', '105910 Letter'],
      ['Boise', 'X-9 Multi 8.5x11'],
      ['Xerox', '3R91720 A4'],
      ['HP', 'ColorPrint 90 A4'],
      ['Staples', 'Multipurpose A4'],
      ['Navigator', 'Premium A4 80gsm'],
      ['Appa', 'A4 80gsm Ream'],
      ['Double A', 'A4 80gsm Box'],
    ],
  },
  {
    categoryCode: 'FURNITURE',
    skuPrefix: 'FRN',
    items: [
      ['Herman Miller', 'Aeron Workstation'],
      ['Steelcase', 'Flex Table'],
      ['Haworth', 'Compose Panel'],
      ['IKEA', 'BEKANT Desk Set'],
      ['HON', 'Ignition 2.0'],
      ['Herman Miller', 'Ethospace'],
      ['Knoll', 'Antenna Workstation'],
      ['Steelcase', 'Answer Panel'],
      ['OFS', 'Genus Bench'],
      ['Allsteel', 'Gather Table'],
    ],
  },
  {
    categoryCode: 'CHAIR',
    skuPrefix: 'CHR',
    items: [
      ['Herman Miller', 'Aeron Chair B'],
      ['Steelcase', 'Gesture Chair'],
      ['Humanscale', 'Freedom Chair'],
      ['Haworth', 'Fern Chair'],
      ['Knoll', 'ReGeneration'],
      ['Steelcase', 'Leap V2'],
      ['Herman Miller', 'Sayl Chair'],
      ['Autonomous', 'ErgoChair Pro'],
      ['HON', 'Nucleus Chair'],
      ['Sihoo', 'M57 Ergonomic'],
    ],
  },
  {
    categoryCode: 'DESK',
    skuPrefix: 'DSK',
    items: [
      ['Herman Miller', 'Motia Sit-Stand'],
      ['Steelcase', 'Solo Sit-Stand'],
      ['Knoll', 'Series 2 Bench'],
      ['IKEA', 'BEKANT Work Desk'],
      ['Varidesk', 'ProDesk 60'],
      ['FlexiSpot', 'E7 Pro'],
      ['Uplift', 'V2 Standing Desk'],
      ['Fully', 'Jarvis Bamboo'],
      ['ApexDesk', 'Elite 71'],
      ['Stand Desk', 'Basic Pro'],
    ],
  },
  {
    categoryCode: 'CABINET',
    skuPrefix: 'CAB',
    items: [
      ['HON', 'Brigade 800'],
      ['Lorell', '61628 Lateral'],
      ['Hirsh', '20000 Series'],
      ['Safco', '4255GR Lateral'],
      ['Tennsco', 'SL-151878'],
      ['HON', 'H514 Vertical'],
      ['Steelcase', 'Series 900 Cabinet'],
      ['Haworth', 'X-Series Pedestal'],
      ['Global', '9300 Series'],
      ['Sandusky', 'MV5E461860'],
    ],
  },
  {
    categoryCode: 'LOCKER',
    skuPrefix: 'LCK',
    items: [
      ['Salsbury', '78000 Series'],
      ['Penco', 'Vanguard'],
      ['Tennsco', 'SL-151878 Locker'],
      ['Lyon', '60000 Series'],
      ['Hallowell', 'U3258-3A'],
      ['Republic', 'RL-251860'],
      ['Penco', 'Patriot Locker'],
      ['American Locker', 'AL6 Series'],
      ['Hallowell', 'U3262 Locker'],
      ['Tennsco', 'SL-1878'],
    ],
  },
  {
    categoryCode: 'VEHICLE',
    skuPrefix: 'VHL',
    items: [
      ['Toyota', 'Camry 2023'],
      ['Ford', 'F-150 2022'],
      ['Honda', 'CR-V 2023'],
      ['Chevrolet', 'Silverado 2022'],
      ['Toyota', 'Prius 2023'],
      ['Ford', 'Explorer 2022'],
      ['Honda', 'Accord 2023'],
      ['Chevrolet', 'Equinox 2022'],
      ['Toyota', 'RAV4 2023'],
      ['Nissan', 'Altima 2022'],
    ],
  },
  {
    categoryCode: 'TRUCK',
    skuPrefix: 'TRK',
    items: [
      ['Ford', 'F-350 Super Duty'],
      ['Chevrolet', 'Silverado 3500HD'],
      ['Ram', '3500 Heavy Duty'],
      ['GMC', 'Sierra 3500HD'],
      ['Toyota', 'Tundra 2023'],
      ['Ford', 'F-250 Super Duty'],
      ['Ram', '2500 Power Wagon'],
      ['Chevrolet', 'Colorado Z71'],
      ['Nissan', 'Titan Pro-4X'],
      ['Toyota', 'Tacoma TRD Pro'],
    ],
  },
  {
    categoryCode: 'CAR',
    skuPrefix: 'CAR',
    items: [
      ['Toyota', 'Camry SE 2023'],
      ['Honda', 'Accord Sport 2023'],
      ['Ford', 'Mustang EcoBoost'],
      ['Chevrolet', 'Malibu LS'],
      ['Nissan', 'Sentra SV'],
      ['Toyota', 'Corolla LE'],
      ['Honda', 'Civic EX'],
      ['Hyundai', 'Elantra SEL'],
      ['Kia', 'Forte GT-Line'],
      ['Mazda', 'Mazda3 Select'],
    ],
  },
  {
    categoryCode: 'BICYCLE',
    skuPrefix: 'BCL',
    items: [
      ['Trek', 'FX 3 Disc'],
      ['Specialized', 'Crosstrail Sport'],
      ['Giant', 'Escape 3'],
      ['Cannondale', 'Quick 5'],
      ['Scott', 'Sub Sport 10'],
      ['Trek', 'Marlin 5'],
      ['Specialized', 'Sirrus 2.0'],
      ['Giant', 'Roam 3'],
      ['Cannondale', 'Treadwell 2'],
      ['Scott', 'Sub Cross 30'],
    ],
  },
  {
    categoryCode: 'TOOL',
    skuPrefix: 'TOL',
    items: [
      ['Stanley', '190-piece Set'],
      ['Craftsman', '230-piece Set'],
      ['DeWalt', '132-piece Kit'],
      ['Milwaukee', '48-22-0100'],
      ['Husky', '268-piece Set'],
      ['Klein Tools', '94130'],
      ['Wera', '05135926001'],
      ['Snap-on', 'OEXM710'],
      ['Knipex', '002119V03'],
      ['Bahco', 'S1000 Set'],
    ],
  },
  {
    categoryCode: 'HAMMER',
    skuPrefix: 'HMR',
    items: [
      ['Stanley', '51-624'],
      ['DeWalt', 'DWHT51138'],
      ['Estwing', 'E3-16S'],
      ['Milwaukee', '48-22-9320'],
      ['Vaughan', 'SC16'],
      ['OX', 'P081616'],
      ['Dalluge', '7750'],
      ['Stiletto', 'TB10MC-15'],
      ['Fiskars', '750630'],
      ['Craftsman', 'CMHT51395'],
    ],
  },
  {
    categoryCode: 'DRILL',
    skuPrefix: 'DRL',
    items: [
      ['DeWalt', 'DCD791D2'],
      ['Milwaukee', '2803-22'],
      ['Bosch', 'GSR18V-190'],
      ['Makita', 'XFD131'],
      ['Ryobi', 'PCL205K2'],
      ['DeWalt', 'DCD701B'],
      ['Hilti', 'SF 6H-A22'],
      ['Festool', 'TDC18/4'],
      ['Black & Decker', 'BDCDD12C'],
      ['Metabo', 'BS18L'],
    ],
  },
  {
    categoryCode: 'LADDER',
    skuPrefix: 'LDR',
    items: [
      ['Werner', 'D1232-2'],
      ['Louisville', 'FM2024'],
      ['DeWalt', 'DXLA-1030010'],
      ['Gorilla', 'GLF-5X'],
      ['Little Giant', '14109-001'],
      ['Werner', 'T7420'],
      ['Louisville', 'MP2-08'],
      ['Telesteps', '1600ET'],
      ['Bailey', 'FS13'],
      ['Hailo', 'L90 EasyClix'],
    ],
  },
  {
    categoryCode: 'UNIFORM',
    skuPrefix: 'UNF',
    items: [
      ['Carhartt', 'J130 BLK Jacket'],
      ['Dickies', 'DC131 Coverall'],
      ['Duluth', 'Fire Hose Pants'],
      ['Wrangler', 'WP80WH Work Shirt'],
      ['Red Kap', 'PT20WH Pant'],
      ['Carhartt', 'K140 BLK Shirt'],
      ['Dickies', 'TC246 Coverall'],
      ['Ariat', '10016240 Shirt'],
      ['Bulwark', 'EXCEL FR Shirt'],
      ['Portwest', 'BZ30NAR Jacket'],
    ],
  },
  {
    categoryCode: 'BADGE',
    skuPrefix: 'BGD',
    items: [
      ['HID', 'Prox Card II'],
      ['Honeywell', '060010 Badge'],
      ['Farpointe', 'P-50'],
      ['Brady', 'SFYP1-PKT'],
      ['Identiv', '4022'],
      ['HID', 'iClass SE Card'],
      ['Zebra', 'P330i Printed'],
      ['Brady', 'M-194-499'],
      ['Fargo', 'DTC1250e Card'],
      ['Matica', 'MC110 Card'],
    ],
  },
  {
    categoryCode: 'KEYCARD',
    skuPrefix: 'KYC',
    items: [
      ['HID', 'iCLASS SE Key'],
      ['Honeywell', 'HL-ACC3'],
      ['Assa Abloy', 'ARX00S'],
      ['Dormakaba', 'EVO-RCX'],
      ['Salto', 'PCM01'],
      ['HID', 'Omnikey 5427'],
      ['Gallagher', 'T11 Reader Key'],
      ['Lenel', 'LNL-1300 Card'],
      ['Tyco', 'ADE-0100'],
      ['Paxton', 'Net2 Entry Key'],
    ],
  },
  {
    categoryCode: 'CAMERA',
    skuPrefix: 'CAM',
    items: [
      ['Hikvision', 'DS-2CD2T47G2'],
      ['Dahua', 'IPC-HDW3849H'],
      ['Axis', 'P3245-LV'],
      ['Bosch', 'FLEXIDOME 5100i'],
      ['Sony', 'SNC-VM772R'],
      ['Hanwha', 'QNV-8080R'],
      ['Vivotek', 'FD9189-H'],
      ['Avigilon', '2.0C-H5M-D1'],
      ['Genetec', 'APLC8-S'],
      ['Mobotix', 'M73'],
    ],
  },
  {
    categoryCode: 'ALARM',
    skuPrefix: 'ALM',
    items: [
      ['Bosch', 'DS151i'],
      ['Honeywell', '5816WMWH'],
      ['DSC', 'PG9303'],
      ['Tyco', 'SPER Sensor'],
      ['Ademco', '5899B'],
      ['Bosch', 'DS160I'],
      ['Visonic', 'MC-302 PG2'],
      ['Pyronix', 'KFPB-WE'],
      ['Risco', 'RWTDP01-1'],
      ['Scantronic', 'SC-700'],
    ],
  },
  {
    categoryCode: 'SENSOR',
    skuPrefix: 'SNS',
    items: [
      ['Bosch', 'DS250I PIR'],
      ['Honeywell', 'DT8035'],
      ['Axis', 'T8351-E'],
      ['Schneider', 'XCC3410PS1'],
      ['Siemens', '7MH5413'],
      ['Bosch', 'BMP388'],
      ['Texas Instruments', 'OPT3001'],
      ['Omron', 'E2B-M12'],
      ['Sick', 'WT2S-V430'],
      ['Banner', 'PresencePLUS P4'],
    ],
  },
  {
    categoryCode: 'SOFTWARE',
    skuPrefix: 'SFW',
    items: [
      ['Microsoft', 'Office 365 E3'],
      ['Adobe', 'Creative Cloud'],
      ['Autodesk', 'AutoCAD 2024'],
      ['Salesforce', 'Sales Cloud Pro'],
      ['Slack', 'Business+'],
      ['Microsoft', 'Visio 2021 Pro'],
      ['Adobe', 'Acrobat Pro DC'],
      ['Zoom', 'Business Plan'],
      ['Atlassian', 'Jira Software'],
      ['ServiceNow', 'ITSM Suite'],
    ],
  },
  {
    categoryCode: 'LICENSE',
    skuPrefix: 'LCS',
    items: [
      ['Microsoft', 'CAL Suite'],
      ['Cisco', 'DNA Essentials'],
      ['VMware', 'vSphere 8 Std'],
      ['Red Hat', 'RHEL Server'],
      ['Microsoft', 'Windows Server 2022'],
      ['IBM', 'Rational DOORS'],
      ['Oracle', 'Database EE'],
      ['SAP', 'ERP License'],
      ['Palo Alto', 'Prisma Cloud'],
      ['Nutanix', 'AOS Ultimate'],
    ],
  },
  {
    categoryCode: 'HARDDISK',
    skuPrefix: 'HDK',
    items: [
      ['Seagate', 'IronWolf 4TB'],
      ['WD', 'Red Plus 4TB'],
      ['Toshiba', 'N300 4TB'],
      ['Seagate', 'Exos X18 16TB'],
      ['WD', 'Gold 8TB'],
      ['Samsung', '870 EVO 2TB'],
      ['Crucial', 'MX500 2TB'],
      ['WD', 'Blue SN570 1TB'],
      ['Seagate', 'Barracuda 2TB'],
      ['Toshiba', 'X300 4TB'],
    ],
  },
  {
    categoryCode: 'PENDRIVE',
    skuPrefix: 'PDR',
    items: [
      ['SanDisk', 'Extreme Pro 256GB'],
      ['Samsung', 'Bar Plus 256GB'],
      ['Kingston', 'DataTraveler Max'],
      ['Corsair', 'Flash Survivor'],
      ['PNY', 'PRO Elite 256GB'],
      ['Lexar', 'JumpDrive P30'],
      ['Transcend', 'JetFlash 700'],
      ['Verbatim', 'Store n Go 128GB'],
      ['Seagate', 'Fast SSD 500GB'],
      ['WD', 'My Passport Go 1TB'],
    ],
  },
  {
    categoryCode: 'MEMORY',
    skuPrefix: 'MEM',
    items: [
      ['Corsair', 'Vengeance 32GB DDR5'],
      ['Kingston', 'Fury Beast 32GB'],
      ['G.Skill', 'Trident Z5 32GB'],
      ['Crucial', 'CT32G4DFD832A'],
      ['Samsung', 'M471A4G43AB1 32GB'],
      ['Corsair', 'Dominator Platinum 32GB'],
      ['Kingston', 'ValueRAM 16GB'],
      ['G.Skill', 'Ripjaws V 16GB'],
      ['Crucial', 'BL2K16G36C16U4B'],
      ['HyperX', 'Fury RGB 32GB'],
    ],
  },
  {
    categoryCode: 'DISPLAY',
    skuPrefix: 'DSP',
    items: [
      ['Samsung', 'QM55R 55"'],
      ['LG', '55UN640S 55"'],
      ['NEC', 'MultiSync M431 43"'],
      ['Philips', 'BDL4330QL 43"'],
      ['Sharp', 'PN-Q750 75"'],
      ['Samsung', 'QM43R 43"'],
      ['LG', '43UN640S 43"'],
      ['Planar', 'EPIQE55H 55"'],
      ['ViewSonic', 'CDE5520 55"'],
      ['Vestel', '55UD883 55"'],
    ],
  },
];

export class SeedAssets1743552005000 implements MigrationInterface {
  name = 'SeedAssets1743552005000';

  async up(queryRunner: QueryRunner): Promise<void> {
    // Fetch all category IDs up-front for efficient lookup
    const catRows: Array<{ id: number; code: string }> = await queryRunner.query(`SELECT id, code FROM category`);
    const categoryMap = new Map<string, number>(catRows.map((r) => [r.code, r.id]));

    // Fetch all employee IDs ordered by employee_code for deterministic cycling
    const empRows: Array<{ id: number }> = await queryRunner.query(
      `SELECT id FROM employee ORDER BY employee_code ASC`,
    );
    const employeeIds = empRows.map((r) => r.id);

    let empIndex = 0;

    // Uneven procurement distribution across 2026 (sums to 500).
    // Heavy in Jan (new budget) and Dec (year-end spend); light in Jul-Aug (summer).
    // Largest gap: Dec (80) vs Aug (18) = 62 assets apart.
    //             Jan  Feb  Mar  Apr  May  Jun  Jul  Aug  Sep  Oct  Nov  Dec
    const dist = [58, 50, 44, 38, 34, 28, 20, 18, 34, 44, 52, 80];

    // Build a flat, chronologically-ordered array of 500 timestamps (one per asset).
    const timestamps: Date[] = [];
    for (let m = 0; m < 12; m++) {
      const count = dist[m];
      const monthStart = new Date(2026, m, 1, 8, 0, 0).getTime();
      const monthEnd = new Date(2026, m + 1, 0, 18, 0, 0).getTime(); // last day at 18:00
      for (let j = 0; j < count; j++) {
        const t = count === 1 ? monthStart : monthStart + (j / (count - 1)) * (monthEnd - monthStart);
        timestamps.push(new Date(Math.round(t)));
      }
    }

    let assetIndex = 0;

    for (const config of assetConfigs) {
      const categoryId = categoryMap.get(config.categoryCode);
      if (!categoryId) {
        throw new Error(`Category not found: ${config.categoryCode}`);
      }

      for (let i = 0; i < config.items.length; i++) {
        const [brand, model] = config.items[i];
        const sku = `${config.skuPrefix}-${String(i + 1).padStart(3, '0')}`;
        const name = `${brand} ${model}`;
        const description = `${brand} ${model} - assigned as a ${config.categoryCode.toLowerCase()} asset for organizational use.`;

        // First 6 assets per category get an employee; last 4 do not
        const employeeId = i < 6 ? employeeIds[empIndex++ % employeeIds.length] : null;

        const createdAt = timestamps[assetIndex++];

        await queryRunner.query(
          `INSERT INTO asset (sku, name, description, model, brand, category_id, employee_id, "createdAt")
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [sku, name, description, model, brand, categoryId, employeeId, createdAt],
        );
      }
    }
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    // Remove all assets whose SKU matches the {3-UPPER-LETTERS}-{3-DIGITS} seed pattern
    await queryRunner.query(`DELETE FROM asset WHERE sku ~ '^[A-Z]{3}-[0-9]{3}$'`);
  }
}
