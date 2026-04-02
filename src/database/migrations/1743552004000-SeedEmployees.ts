import { MigrationInterface, QueryRunner } from 'typeorm';

// All seed employees share this password hash.
// Plain-text value: "password"  — change after seeding in production.
const PASSWORD_HASH = '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lh32';

interface EmployeeSeed {
  fullName: string;
  employeeCode: string; // exactly 10 chars
  email: string;
  roleCode: string;
}

const employees: EmployeeSeed[] = [
  // ── Admin (5) ────────────────────────────────────────────────────────────
  { fullName: 'John Smith',          employeeCode: 'EMP0000001', email: 'john.smith@company.com',          roleCode: 'admin'    },
  { fullName: 'Jane Johnson',        employeeCode: 'EMP0000002', email: 'jane.johnson@company.com',        roleCode: 'admin'    },
  { fullName: 'Robert Williams',     employeeCode: 'EMP0000003', email: 'robert.williams@company.com',     roleCode: 'admin'    },
  { fullName: 'Emily Brown',         employeeCode: 'EMP0000004', email: 'emily.brown@company.com',         roleCode: 'admin'    },
  { fullName: 'Michael Davis',       employeeCode: 'EMP0000005', email: 'michael.davis@company.com',       roleCode: 'admin'    },
  // ── Managers (5) ─────────────────────────────────────────────────────────
  { fullName: 'Sarah Wilson',        employeeCode: 'EMP0000006', email: 'sarah.wilson@company.com',        roleCode: 'manager'  },
  { fullName: 'David Martinez',      employeeCode: 'EMP0000007', email: 'david.martinez@company.com',      roleCode: 'manager'  },
  { fullName: 'Laura Anderson',      employeeCode: 'EMP0000008', email: 'laura.anderson@company.com',      roleCode: 'manager'  },
  { fullName: 'James Taylor',        employeeCode: 'EMP0000009', email: 'james.taylor@company.com',        roleCode: 'manager'  },
  { fullName: 'Amanda Thomas',       employeeCode: 'EMP0000010', email: 'amanda.thomas@company.com',       roleCode: 'manager'  },
  // ── Employees (5) ────────────────────────────────────────────────────────
  { fullName: 'Christopher Jackson', employeeCode: 'EMP0000011', email: 'christopher.jackson@company.com', roleCode: 'employee' },
  { fullName: 'Jessica White',       employeeCode: 'EMP0000012', email: 'jessica.white@company.com',       roleCode: 'employee' },
  { fullName: 'Daniel Harris',       employeeCode: 'EMP0000013', email: 'daniel.harris@company.com',       roleCode: 'employee' },
  { fullName: 'Ashley Martin',       employeeCode: 'EMP0000014', email: 'ashley.martin@company.com',       roleCode: 'employee' },
  { fullName: 'Matthew Thompson',    employeeCode: 'EMP0000015', email: 'matthew.thompson@company.com',    roleCode: 'employee' },
  // ── IT Staff (5) ─────────────────────────────────────────────────────────
  { fullName: 'Joshua Garcia',       employeeCode: 'EMP0000016', email: 'joshua.garcia@company.com',       roleCode: 'it_staff' },
  { fullName: 'Stephanie Robinson',  employeeCode: 'EMP0000017', email: 'stephanie.robinson@company.com',  roleCode: 'it_staff' },
  { fullName: 'Andrew Clark',        employeeCode: 'EMP0000018', email: 'andrew.clark@company.com',        roleCode: 'it_staff' },
  { fullName: 'Melissa Rodriguez',   employeeCode: 'EMP0000019', email: 'melissa.rodriguez@company.com',   roleCode: 'it_staff' },
  { fullName: 'Nicholas Lewis',      employeeCode: 'EMP0000020', email: 'nicholas.lewis@company.com',      roleCode: 'it_staff' },
  // ── Finance (5) ──────────────────────────────────────────────────────────
  { fullName: 'Tyler Lee',           employeeCode: 'EMP0000021', email: 'tyler.lee@company.com',           roleCode: 'finance'  },
  { fullName: 'Brittany Walker',     employeeCode: 'EMP0000022', email: 'brittany.walker@company.com',     roleCode: 'finance'  },
  { fullName: 'Ryan Hall',           employeeCode: 'EMP0000023', email: 'ryan.hall@company.com',           roleCode: 'finance'  },
  { fullName: 'Samantha Allen',      employeeCode: 'EMP0000024', email: 'samantha.allen@company.com',      roleCode: 'finance'  },
  { fullName: 'Brandon Young',       employeeCode: 'EMP0000025', email: 'brandon.young@company.com',       roleCode: 'finance'  },
];

export class SeedEmployees1743552004000 implements MigrationInterface {
  name = 'SeedEmployees1743552004000';

  async up(queryRunner: QueryRunner): Promise<void> {
    for (const emp of employees) {
      await queryRunner.query(
        `INSERT INTO employee (full_name, employee_code, email, password, role_id)
         VALUES ($1, $2, $3, $4, (SELECT id FROM role WHERE role_code = $5))`,
        [emp.fullName, emp.employeeCode, emp.email, PASSWORD_HASH, emp.roleCode],
      );
    }
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    const codes = employees.map((e) => e.employeeCode);
    await queryRunner.query(
      `DELETE FROM employee WHERE employee_code = ANY($1)`,
      [codes],
    );
  }
}
