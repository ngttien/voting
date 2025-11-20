# Multi-Voting DApp

Hệ thống bầu chọn phi tập trung cho phép tạo và quản lý nhiều cuộc bầu chọn độc lập trên Ethereum blockchain.

## Tính năng

- **Tạo cuộc bầu chọn**: Bất kỳ ai cũng có thể tạo cuộc bầu chọn mới và trở thành admin
- **Tham gia bầu chọn**: Chọn và tham gia bất kỳ cuộc bầu chọn nào
- **Quản lý độc lập**: Mỗi cuộc bầu chọn có admin riêng, ứng viên riêng
- **Bỏ phiếu minh bạch**: Mỗi người chỉ bỏ phiếu 1 lần/cuộc bầu chọn
- **Kết quả real-time**: Xem kết quả ngay lập tức
- **Quản lý admin**: Thêm ứng viên, mở/đóng bầu cử

## Công nghệ

- **Frontend**: React 19, Vite, React Router
- **Blockchain**: Ethereum (Sepolia Testnet)
- **Smart Contracts**: Solidity 0.8.20
- **Web3**: Ethers.js v6
- **Deployment**: Vercel

## Cài đặt

### Yêu cầu

- Node.js 16+
- MetaMask
- Sepolia ETH test

## Hướng dẫn sử dụng

### Cho người dùng:

1. **Cài đặt MetaMask** và chuyển sang Sepolia testnet
2. **Lấy ETH test** từ https://cloud.google.com/application/web3/faucet/ethereum/sepolia
3. **Kết nối ví** trên ứng dụng
4. **Tạo hoặc tham gia** cuộc bầu chọn

### Tạo cuộc bầu chọn:

1. Click "Tạo Bầu Chọn"
2. Nhập tên và mô tả
3. Xác nhận transaction
4. Trở thành admin
5. Thêm ứng viên
6. Mở bầu cử

### Tham gia bầu chọn:

1. Click "Tham Gia Bầu Chọn"
2. Chọn cuộc bầu chọn từ danh sách
3. Bỏ phiếu cho ứng viên
4. Xem kết quả

## Smart Contracts

### VotingFactory

- Quản lý tất cả cuộc bầu chọn
- Tạo cuộc bầu chọn mới
- Lưu danh sách cuộc bầu chọn

### Voting

- Contract cho mỗi cuộc bầu chọn
- Quản lý ứng viên và bỏ phiếu
- Mỗi cuộc có admin riêng

Chia sẻ URL này với mọi người!

## Troubleshooting

### Lỗi "Cannot connect to contract"

- Kiểm tra MetaMask đã chọn Sepolia
- Refresh trang
- Xem console log (F12)

### Lỗi "Insufficient funds"

- Lấy ETH test từ faucet
- Đợi vài phút để transaction confirm

### Lỗi "Transaction failed"

- Kiểm tra gas fee
- Thử lại sau vài giây

## Licensóe

MIT License - Tự do sử dụng cho mục đích cá nhân và thương mại

## Đóng góp

Mọi đóng góp đều được chào đón! Hãy tạo Pull Request hoặc Issue.

## Credits

Được xây dựng với React và Ethereum

---

**Lưu ý:** Đây là ứng dụng demo trên testnet. Không sử dụng cho production với tiền thật.

**⭐ Nếu thấy hữu ích, hãy cho project một star!**
