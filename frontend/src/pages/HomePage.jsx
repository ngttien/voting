import React, { useContext } from 'react';
import { BlockchainContext } from '../context/BlockchainContext';

const HomePage = () => {
    const { account } = useContext(BlockchainContext);

    return (
        <div className="page-container">
            <h1>Chào mừng đến với dApp Bỏ Phiếu</h1>
            <p>Sử dụng React, Node.js (MVC) và Ethereum Blockchain.</p>
            
            {account ? (
                <div>
                    <p>Bạn đã kết nối với ví:</p>
                    <strong>{account}</strong>
                </div>
            ) : (
                <p>Vui lòng kết nối ví (MetaMask) ở góc trên bên phải để bắt đầu.</p>
            )}
        </div>
    );
};

export default HomePage;