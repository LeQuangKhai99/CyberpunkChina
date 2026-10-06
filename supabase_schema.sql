-- =========================================================================
-- PINYIN POP! - SUPABASE DATABASE SCHEMA (HỖ TRỢ ADMIN DASHBOARD & BÁO CÁO)
-- 
-- Hướng dẫn:
-- 1. Mở Supabase (https://supabase.com) -> Vào mục "SQL Editor"
-- 2. Dán toàn bộ nội dung file này vào và bấm "RUN" (Ctrl+Enter)
-- =========================================================================

-- 1. BẢNG HỒ SƠ NGƯỜI DÙNG (profiles)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  display_name text,
  avatar_url text,
  role text default 'user' not null, -- 'admin' hoặc 'user'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Nếu bảng đã tồn tại từ trước, đảm bảo có cột role
alter table public.profiles add column if not exists role text default 'user' not null;

-- 2. BẢNG TIẾN ĐỘ HỌC TẬP ĐA THIẾT BỊ (user_progress)
create table if not exists public.user_progress (
  user_id uuid references auth.users on delete cascade primary key,
  
  -- Tiến độ Thẻ Flashcard 3D
  flashcard_mastered jsonb default '[]'::jsonb not null,
  flashcard_review jsonb default '[]'::jsonb not null,
  flashcard_favs jsonb default '[]'::jsonb not null,
  
  -- Tiến độ Tập Viết Chữ Hán (Bút Thuận)
  stroke_completed_count int default 0 not null,
  stroke_correct_count int default 0 not null,
  stroke_total_attempts int default 0 not null,
  stroke_streak int default 0 not null,
  stroke_completed_chars jsonb default '[]'::jsonb not null,
  
  -- Điểm số & Kỷ lục các Game
  pinyin_pop_highscore int default 0 not null,
  tone_master_score int default 0 not null,
  puzzle_score int default 0 not null,
  
  -- Trường dữ liệu mở rộng
  extra_data jsonb default '{}'::jsonb not null,
  
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. HÀM KIỂM TRA QUYỀN ADMIN (Security Definer)
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
end;
$$ language plpgsql security definer;

-- 4. BẬT BẢO MẬT PHÂN QUYỀN THEO HÀNG (Row Level Security - RLS)
alter table public.profiles enable row level security;
alter table public.user_progress enable row level security;

-- Policies cho profiles:
-- Người dùng xem hồ sơ của mình HOẶC Admin được xem toàn bộ hồ sơ
drop policy if exists "Users can view their own profile" on public.profiles;
create policy "Users can view their own profile" on public.profiles
  for select using (auth.uid() = id or public.is_admin());

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile" on public.profiles
  for update using (auth.uid() = id or public.is_admin());

drop policy if exists "Users can insert their own profile" on public.profiles;
create policy "Users can insert their own profile" on public.profiles
  for insert with check (auth.uid() = id);

-- Policies cho user_progress:
-- Người dùng xem tiến độ của mình HOẶC Admin được xem toàn bộ để làm báo cáo
drop policy if exists "Users can view their own progress" on public.user_progress;
create policy "Users can view their own progress" on public.user_progress
  for select using (auth.uid() = user_id or public.is_admin());

drop policy if exists "Users can update their own progress" on public.user_progress;
create policy "Users can update their own progress" on public.user_progress
  for update using (auth.uid() = user_id or public.is_admin());

drop policy if exists "Users can insert their own progress" on public.user_progress;
create policy "Users can insert their own progress" on public.user_progress
  for insert with check (auth.uid() = user_id or public.is_admin());

-- 5. TRIGGER TỰ ĐỘNG KHỞI TẠO BẢN GHI KHI ĐĂNG KÝ MỚI
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, display_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    case 
      when new.email in ('admin@pinyinpop.com', 'admin@gmail.com') then 'admin'
      else 'user'
    end
  )
  on conflict (id) do nothing;

  insert into public.user_progress (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Gán quyền admin ngay cho tài khoản admin hiện có:
update public.profiles 
set role = 'admin' 
where email in ('admin@pinyinpop.com', 'admin@gmail.com');

-- =========================================================================
-- 6. ĐỒNG BỘ TOÀN BỘ USERS ĐÃ CÓ TRONG auth.users VÀO profiles & user_progress
-- (Nếu bạn đã có sẵn 2 user nhưng trang admin chỉ hiện 1, chạy lệnh bên dưới sẽ nạp User 2 vào ngay!)
-- =========================================================================
insert into public.profiles (id, email, display_name, role)
select 
  id, 
  email, 
  coalesce(raw_user_meta_data->>'full_name', split_part(email, '@', 1)),
  case 
    when email in ('admin@pinyinpop.com', 'admin@gmail.com') then 'admin'
    else 'user'
  end
from auth.users
on conflict (id) do update set
  email = excluded.email,
  display_name = coalesce(public.profiles.display_name, excluded.display_name);

insert into public.user_progress (user_id)
select id from auth.users
on conflict (user_id) do nothing;
