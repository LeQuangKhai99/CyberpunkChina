-- =========================================================================
-- PINYIN POP! - SUPABASE DATABASE SCHEMA (HOÀN TOÀN MIỄN PHÍ)
-- 
-- Hướng dẫn cài đặt trong 1 phút:
-- 1. Đăng nhập Supabase (https://supabase.com) -> Tạo New Project
-- 2. Vào mục "SQL Editor" ở thanh menu bên trái
-- 3. Bấm "New query", dán toàn bộ nội dung file này vào và bấm "RUN" (hoặc Ctrl+Enter)
-- 4. Vào mục "Project Settings" -> "API" để lấy URL và Khóa anon public key.
-- =========================================================================

-- 1. BẢNG HỒ SƠ NGƯỜI DÙNG (profiles)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  display_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

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
  
  -- Trường dữ liệu mở rộng cho tương lai
  extra_data jsonb default '{}'::jsonb not null,
  
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. BẬT BẢO MẬT PHÂN QUYỀN THEO HÀNG (Row Level Security - RLS)
alter table public.profiles enable row level security;
alter table public.user_progress enable row level security;

-- Chính sách bảo mật (RLS Policies) cho profiles:
-- Người dùng chỉ được xem và cập nhật hồ sơ của chính mình
drop policy if exists "Users can view their own profile" on public.profiles;
create policy "Users can view their own profile" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile" on public.profiles
  for update using (auth.uid() = id);

drop policy if exists "Users can insert their own profile" on public.profiles;
create policy "Users can insert their own profile" on public.profiles
  for insert with check (auth.uid() = id);

-- Chính sách bảo mật (RLS Policies) cho user_progress:
-- Mỗi người dùng chỉ được đọc, ghi và cập nhật tiến độ của chính mình
drop policy if exists "Users can view their own progress" on public.user_progress;
create policy "Users can view their own progress" on public.user_progress
  for select using (auth.uid() = user_id);

drop policy if exists "Users can update their own progress" on public.user_progress;
create policy "Users can update their own progress" on public.user_progress
  for update using (auth.uid() = user_id);

drop policy if exists "Users can insert their own progress" on public.user_progress;
create policy "Users can insert their own progress" on public.user_progress
  for insert with check (auth.uid() = user_id);

-- 4. TRIGGER TỰ ĐỘNG KHỞI TẠO BẢN GHI KHI ĐĂNG KÝ MỚI
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
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
