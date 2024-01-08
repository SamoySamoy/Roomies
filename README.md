# Roomies

## Installation

### Yêu cầu

- MYSQL
- NodeJS 18.17

### Môi trường local

- Clone project:

```bash
git clone https://github.com/SamoySamoy/roomies.git
```

- Checkout nhánh `local`:

```bash
git checkout origin/local
```

#### B1: Set up biến môi trường ở server

- Di chuyển vào thư mục `server`

```bash
cd server
```

- Xem ví dụ các biến môi trường cần thiết ở file `.env.example`

- Tạo file `.env` và điền các biến môi trường bắt buộc phải có:

```bash
PORT_LOCAL=

DATABASE_URL_LOCAL=

ACCESS_TOKEN_SECRET=
REFRESH_TOKEN_SECRET=
RESET_TOKEN_SECRET=

SMTP_HOST=
SMTP_PORT=
SMTP_USERNAME=
SMTP_PASSWORD=
```

- Lưu ý với biến môi trường `PORT_LOCAL`:

  - Sẽ có 2 server được chạy: Express và PeerServerJS (phục vụ WebRTC P2P) nên sẽ có 2 cổng được sử dụng.
  - Ví dụ `PORT_LOCAL=5173` thì Express sẽ chạy ở cổng `5173`và PeerSeerJS chạy ở cổng `5174` (PeerServerJS chạy ở cổng hơn 1 đơn vị)

- Lưu ý với biến môi trường `DATABASE_URL_LOCAL`:

  - Có định dạng như sau: `mysql://username:password@host:port/dbname`
  - Ví dụ: `DATABASE_URL_LOCAL=mysql://root:123@localhost:3306/roomies`
  - Đảm bảo DB chạy và trong DB đã có sẵn bảng `roomies`

- Lưu ý với biến môi trường `SMTP_`:
  - Được sử dụng cho chức năng lấy lại mật khẩu bằng email
  - Sử dụng SMTP của Gmail

#### B2: Set up biến môi trường ở client

- Di chuyển vào thư mục `client`

```bash
cd client
```

- Mở file `constants.ts` ở folder `client/src/lib/constants.ts`

- Sửa giá trị của biến `SERVER_PORT_LOCAL` thành số cổng vừa set up ở file '.env' phía trên. Ví dụ:

```bash
# .env

PORT_LOCAL = 5173
```

```ts
// client/src/lib/constants.ts

export const SERVER_PORT_LOCAL = 5173 as const;
```

#### B3: Set up Datbase ORM

- Thực hiện set up Database bằng ORM Prisma

```bash
cd server
npm install

# Reset DB
npm run db:reset
# Tạo bảng
npm run db:push
# Tạo client code
npm run db:client
```

#### B4: Build

- Đối với các máy Linux hoặc Window có thể chạy file `.sh`, chạy file `build.sh` như sau:

```bash
# Đảm bảo đang đừng ở folder roomies
# /path/to/roomies

sudo chmod +x ./build.sh
./build.sh
```

- Nếu không thể chạy file `.sh` hoặc chạy lỗi có thể thực hiện tuần tự các bước có trong file

#### B5: Chạy server

```bash
cd server

npm start
```

### Môi trường nền tảng int3306.freeddns
