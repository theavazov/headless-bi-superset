import React from 'react';
import { logout } from '../../api/auth';
import { useNavigate } from 'react-router-dom';
import { logOutIcon } from '../../utils/icons';

export const Footer: React.FC = () => {
    const navigate = useNavigate();

    return (
        <footer>
            <div className="container container-xl footer-inner">
                <p className="footer-text">
                    Обзор HUMO · {new Date().getFullYear()}
                </p>
                <button onClick={() => {
                    logout();
                    navigate("/login", {
                        replace: true,
                    });
                }} className="footer-text btn_logout">{logOutIcon} Выйти</button>
            </div>
        </footer>
    );
};