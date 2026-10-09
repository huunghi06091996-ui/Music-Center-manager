create extension if not exists "pgcrypto";

create table branches (
  id uuid primary key default gen_random_uuid(), name text not null, code text not null unique,
  address text, phone text, email text, is_active boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table students (
  id uuid primary key default gen_random_uuid(), branch_id uuid not null references branches(id),
  student_code text not null unique, full_name text not null, date_of_birth date, gender text,
  phone text, email text, status text not null default 'active' check(status in ('active','paused','stopped','trial')),
  notes text, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table student_contacts (
  id uuid primary key default gen_random_uuid(), student_id uuid not null references students(id),
  full_name text not null, relationship text, phone text, email text, is_primary boolean not null default false,
  created_at timestamptz not null default now()
);

create table teachers (
  id uuid primary key default gen_random_uuid(), branch_id uuid not null references branches(id),
  teacher_code text not null unique, full_name text not null, phone text, email text, joined_at date,
  status text not null default 'active' check(status in ('active','inactive','on_leave')), notes text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table subjects (
  id uuid primary key default gen_random_uuid(), branch_id uuid not null references branches(id),
  code text not null, name text not null, default_duration_minutes integer not null default 60 check(default_duration_minutes>0),
  is_active boolean not null default true, created_at timestamptz not null default now(), unique(branch_id,code)
);

create table rooms (
  id uuid primary key default gen_random_uuid(), branch_id uuid not null references branches(id),
  code text not null, name text not null, capacity integer default 1 check(capacity>0), is_active boolean not null default true,
  unique(branch_id,code)
);

create table packages (
  id uuid primary key default gen_random_uuid(), branch_id uuid not null references branches(id), subject_id uuid not null references subjects(id),
  name text not null, billing_type text not null check(billing_type in ('package','monthly','per_lesson')),
  lesson_count integer, price numeric(14,2) not null check(price>=0), validity_days integer,
  default_duration_minutes integer not null default 60, is_active boolean not null default true, created_at timestamptz not null default now()
);

create table enrollments (
  id uuid primary key default gen_random_uuid(), student_id uuid not null references students(id), subject_id uuid not null references subjects(id),
  package_id uuid references packages(id), teacher_id uuid not null references teachers(id), start_date date not null, end_date date,
  total_lessons integer, agreed_price numeric(14,2) not null check(agreed_price>=0),
  status text not null default 'active' check(status in ('active','completed','paused','cancelled','expired')),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table schedules (
  id uuid primary key default gen_random_uuid(), enrollment_id uuid not null references enrollments(id), teacher_id uuid not null references teachers(id),
  room_id uuid references rooms(id), weekday smallint not null check(weekday between 1 and 7), start_time time not null, end_time time not null,
  effective_from date not null, effective_to date, status text not null default 'active' check(status in ('active','paused','ended')),
  created_at timestamptz not null default now(), check(end_time>start_time)
);

create table lessons (
  id uuid primary key default gen_random_uuid(), enrollment_id uuid not null references enrollments(id), schedule_id uuid references schedules(id),
  teacher_id uuid not null references teachers(id), room_id uuid references rooms(id), lesson_date date not null, start_time time not null,
  end_time time not null, duration_minutes integer not null check(duration_minutes>0),
  lesson_type text not null default 'regular' check(lesson_type in ('regular','makeup','trial','extra')),
  status text not null default 'scheduled' check(status in ('scheduled','completed','student_absent_excused','student_absent_late','teacher_absent','center_cancelled','makeup_completed','rescheduled','cancelled')),
  original_lesson_id uuid references lessons(id), notes text, created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  check(end_time>start_time)
);

create table attendance (
  id uuid primary key default gen_random_uuid(), lesson_id uuid not null unique references lessons(id),
  student_charge boolean not null default false, teacher_credit boolean not null default false,
  confirmed_by uuid, confirmed_at timestamptz, notes text, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table payments (
  id uuid primary key default gen_random_uuid(), enrollment_id uuid not null references enrollments(id), student_id uuid not null references students(id),
  amount numeric(14,2) not null check(amount>0), payment_date date not null,
  payment_method text not null check(payment_method in ('cash','bank_transfer','card','other')), reference_code text, notes text,
  created_by uuid, created_at timestamptz not null default now()
);

create table teacher_rates (
  id uuid primary key default gen_random_uuid(), teacher_id uuid not null references teachers(id), subject_id uuid references subjects(id),
  lesson_type text, rate_basis text not null check(rate_basis in ('per_hour','per_lesson')), rate_amount numeric(14,2) not null check(rate_amount>=0),
  effective_from date not null, effective_to date, created_at timestamptz not null default now()
);

create table payroll_periods (
  id uuid primary key default gen_random_uuid(), branch_id uuid not null references branches(id), name text not null,
  start_date date not null, end_date date not null, status text not null default 'draft' check(status in ('draft','review','locked','paid')),
  locked_at timestamptz, locked_by uuid, created_at timestamptz not null default now(), check(end_date>=start_date)
);

create table payroll_entries (
  id uuid primary key default gen_random_uuid(), payroll_period_id uuid not null references payroll_periods(id), teacher_id uuid not null references teachers(id),
  teaching_units numeric(10,2) not null default 0, teaching_amount numeric(14,2) not null default 0,
  adjustment_amount numeric(14,2) not null default 0, total_amount numeric(14,2) not null default 0, notes text,
  created_at timestamptz not null default now(), unique(payroll_period_id,teacher_id)
);

create table payroll_adjustments (
  id uuid primary key default gen_random_uuid(), payroll_entry_id uuid not null references payroll_entries(id),
  adjustment_type text not null check(adjustment_type in ('bonus','deduction','correction')), amount numeric(14,2) not null,
  reason text not null, created_by uuid, created_at timestamptz not null default now()
);

create table audit_logs (
  id uuid primary key default gen_random_uuid(), user_id uuid, action text not null, entity_type text not null, entity_id uuid,
  old_data jsonb, new_data jsonb, created_at timestamptz not null default now()
);

create index idx_lessons_date on lessons(lesson_date);
create index idx_lessons_teacher_date on lessons(teacher_id,lesson_date);
create index idx_lessons_enrollment on lessons(enrollment_id);
create index idx_schedules_teacher on schedules(teacher_id);
create index idx_payments_student on payments(student_id);
create index idx_payments_enrollment on payments(enrollment_id);
create index idx_enrollment_student on enrollments(student_id);

create view enrollment_balances as
select e.id enrollment_id,e.student_id,e.total_lessons,
  count(a.id) filter(where a.student_charge=true) used_lessons,
  case when e.total_lessons is null then null else e.total_lessons-count(a.id) filter(where a.student_charge=true) end remaining_lessons
from enrollments e left join lessons l on l.enrollment_id=e.id left join attendance a on a.lesson_id=l.id
group by e.id,e.student_id,e.total_lessons;

create view enrollment_finance as
select e.id enrollment_id,e.student_id,e.agreed_price amount_due,coalesce(sum(p.amount),0) amount_paid,
  e.agreed_price-coalesce(sum(p.amount),0) balance
from enrollments e left join payments p on p.enrollment_id=e.id
group by e.id,e.student_id,e.agreed_price;
