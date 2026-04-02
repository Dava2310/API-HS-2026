import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedCategories1743552003000 implements MigrationInterface {
  name = 'SeedCategories1743552003000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO category (name, code, description) VALUES
      ('Laptops',            'LAPTOP',    'Portable computing devices for mobile workforce and remote work environments.'),
      ('Desktop Computers',  'DESKTOP',   'High-performance stationary workstations for office-based tasks and operations.'),
      ('Monitors',           'MONITOR',   'Display screens and visual output devices for computer workstations.'),
      ('Keyboards',          'KEYBOARD',  'Input devices for text entry and system navigation at workstations.'),
      ('Computer Mice',      'MOUSE',     'Pointing devices for graphical user interface navigation and control.'),
      ('Printers',           'PRINTER',   'Document printing devices for producing physical copies of digital files.'),
      ('Scanners',           'SCANNER',   'Optical devices for digitizing physical documents and photographs.'),
      ('Webcams',            'WEBCAM',    'Video cameras for video conferencing, online meetings and communications.'),
      ('Mobile Phones',      'PHONE',     'Corporate smartphones issued to employees for business communications.'),
      ('Tablets',            'TABLET',    'Touch-screen portable devices for mobile productivity and presentations.'),
      ('Servers',            'SERVER',    'Enterprise-grade computing servers for hosting applications and services.'),
      ('Network Routers',    'ROUTER',    'Network devices for routing data packets between computer networks.'),
      ('Network Switches',   'SWITCH',    'Network hardware for connecting devices within a local area network.'),
      ('Firewalls',          'FIREWALL',  'Security appliances for monitoring and filtering network traffic.'),
      ('NAS Devices',        'NAS',       'Network attached storage systems for centralized data management.'),
      ('UPS Systems',        'UPS',       'Uninterruptible power supplies for protecting equipment from power outages.'),
      ('Projectors',         'PROJECTOR', 'Projection devices for displaying presentations in meeting rooms.'),
      ('Headsets',           'HEADSET',   'Audio headsets for hands-free communication and noise cancellation.'),
      ('Desk Phones',        'DESKPHONE', 'Fixed-line telephone devices for office communication and internal calls.'),
      ('Cables',             'CABLE',     'Networking and power cables for connecting devices and infrastructure.'),
      ('Adapters',           'ADAPTER',   'Conversion devices for connecting incompatible ports and interfaces.'),
      ('Chargers',           'CHARGER',   'Power charging equipment for mobile devices and portable hardware.'),
      ('Batteries',          'BATTERY',   'Portable power sources for devices and emergency backup systems.'),
      ('Toner Cartridges',   'TONER',     'Print cartridges for laser printers and photocopiers.'),
      ('Paper Supplies',     'PAPER',     'Paper and stationery supplies for office printing and documentation.'),
      ('Office Furniture',   'FURNITURE', 'Desks, tables and furniture pieces for office workspace setup.'),
      ('Office Chairs',      'CHAIR',     'Ergonomic seating solutions for employee comfort and productivity.'),
      ('Work Desks',         'DESK',      'Work surfaces and desk units for employee workstations.'),
      ('Filing Cabinets',    'CABINET',   'Storage cabinets for organizing physical documents and supplies.'),
      ('Employee Lockers',   'LOCKER',    'Secure personal storage lockers for employee belongings.'),
      ('Company Vehicles',   'VEHICLE',   'Motorized vehicles owned by the company for general business use.'),
      ('Company Trucks',     'TRUCK',     'Heavy-duty trucks for logistics, transport and delivery operations.'),
      ('Company Cars',       'CAR',       'Passenger cars assigned to employees for business travel.'),
      ('Bicycles',           'BICYCLE',   'Bicycles for eco-friendly commuting and short-distance business trips.'),
      ('Hand Tools',         'TOOL',      'Manual tools for maintenance, repair and installation tasks.'),
      ('Hammers',            'HAMMER',    'Striking tools for construction, assembly and maintenance work.'),
      ('Power Drills',       'DRILL',     'Rotary drilling tools for installation and construction operations.'),
      ('Ladders',            'LADDER',    'Access equipment for reaching elevated areas during maintenance.'),
      ('Uniforms',           'UNIFORM',   'Company uniforms and workwear issued to staff for identification.'),
      ('ID Badges',          'BADGE',     'Identification badges for employee access control and recognition.'),
      ('Access Keycards',    'KEYCARD',   'Electronic access control cards for secured areas and facilities.'),
      ('Security Cameras',   'CAMERA',    'Surveillance cameras for monitoring premises and ensuring security.'),
      ('Alarm Systems',      'ALARM',     'Security alarm systems for detecting and alerting on intrusions.'),
      ('Sensors',            'SENSOR',    'Electronic sensors for environmental monitoring and automation.'),
      ('Software Licenses',  'SOFTWARE',  'Software application licenses and subscriptions for employee use.'),
      ('Hardware Licenses',  'LICENSE',   'Hardware and firmware license assets tracked for compliance purposes.'),
      ('Hard Disks',         'HARDDISK',  'Storage hard disk drives for data storage and backup purposes.'),
      ('USB Pen Drives',     'PENDRIVE',  'Portable USB flash drives for data transfer and temporary storage.'),
      ('RAM Modules',        'MEMORY',    'Random access memory modules for computer performance upgrades.'),
      ('Digital Displays',   'DISPLAY',   'Digital signage and display screens for public announcements.')
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM category WHERE code IN (
        'LAPTOP','DESKTOP','MONITOR','KEYBOARD','MOUSE','PRINTER','SCANNER','WEBCAM','PHONE','TABLET',
        'SERVER','ROUTER','SWITCH','FIREWALL','NAS','UPS','PROJECTOR','HEADSET','DESKPHONE','CABLE',
        'ADAPTER','CHARGER','BATTERY','TONER','PAPER','FURNITURE','CHAIR','DESK','CABINET','LOCKER',
        'VEHICLE','TRUCK','CAR','BICYCLE','TOOL','HAMMER','DRILL','LADDER','UNIFORM','BADGE',
        'KEYCARD','CAMERA','ALARM','SENSOR','SOFTWARE','LICENSE','HARDDISK','PENDRIVE','MEMORY','DISPLAY'
      )
    `);
  }
}
