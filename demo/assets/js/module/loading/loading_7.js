export function render(node) {
    const nodeId = node._runtimeId; 

    return {
        html: `
            <div id="${nodeId}" class="lucia-coffee-wrapper" style="${node.style || ''}">
                <div class="lucia-coffee-loader" data-action="${node.action || ''}">
                    <div class="cup">
                        <div class="cup-handle"></div>
                        <div class="smoke one"></div>
                        <div class="smoke two"></div>
                        <div class="smoke three"></div>
                    </div>
                    <div class="load">Loading...</div>
                </div>
            </div>
        `,
        css: `
            /* Khung gánh tải hệ thống */
            #${nodeId}.lucia-coffee-wrapper {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                height: fit-content;
                padding: 40px 20px 20px 20px; /* Tăng padding top để khói bay không bị cắt */
                box-sizing: border-box;
            }

            #${nodeId} .lucia-coffee-loader {
                width: 100px;
                height: 100px;
                position: relative;
                animation: shake_${nodeId} 3s infinite ease-in-out;
            }

            /* Thân ly cà phê */
            #${nodeId} .cup {
                position: absolute;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                width: 40px;
                height: 30px;
                background-color: #5b4022cb;
                border: 1px solid #2e2e2e;
                border-radius: 3px 3px 10px 10px;
                z-index: 1;
                animation: cupPulse_${nodeId} 6s infinite ease-in-out;
            }

            /* Đế ly */
            #${nodeId} .cup::before {
                content: "";
                position: absolute;
                bottom: -5px;
                left: 0; /* Xác định rõ tọa độ neo */
                width: calc(100% - 2px);
                height: 6px;
                background: #5b4022cb;
                border: 1px solid #2e2e2e;
                border-top: none;
                border-radius: 50%;
                z-index: -1;
                animation: cupPulse_${nodeId} 6s infinite ease-in-out;
            }

            /* Mặt nước cà phê bên trong */
            #${nodeId} .cup::after {
                content: "";
                position: absolute;
                top: -2px;
                left: 1px;
                width: calc(100% - 2px);
                height: 4px;
                background: #da8920ca;
                border: 1px solid #2e2e2e;
                border-radius: 50%;
                animation: coffeeGlow_${nodeId} 6s infinite ease-in-out;
            }

            /* Quai ly */
            #${nodeId} .cup-handle {
                position: absolute;
                top: 5px;
                right: -10px;
                width: 100px; /* Sửa lỗi kích thước quai bị co */
                width: 10px;
                height: 15px;
                border: 2px solid #2e2e2e;
                border-left: none;
                border-radius: 0 10px 10px 0;
                background: transparent;
            }

            /* Làn khói bốc lên */
            #${nodeId} .smoke {
                position: absolute;
                bottom: 100%;
                left: 50%;
                width: 10px;
                height: 25px;
                background: rgba(72, 67, 67, 0.4);
                border-radius: 50%;
                transform: translateX(-50%);
                animation: rise_${nodeId} 3s infinite ease-in-out;
                filter: blur(4px); /* Giảm blur xuống 4px để khói không bị biến mất hoàn toàn trên một số màn hình */
            }

            #${nodeId} .smoke.one { animation-delay: 0s; }
            #${nodeId} .smoke.two { animation-delay: 0.8s; }
            #${nodeId} .smoke.three { animation-delay: 1.6s; }

            /* Chữ Loading bên dưới */
            #${nodeId} .load {
                position: absolute;
                bottom: 0;
                left: 50%;
                transform: translateX(-50%);
                font-size: 12px;
                font-family: sans-serif;
                color: #2e2e2e;
                opacity: 0.6;
            }

            /* ─── HỆ THỐNG KEYFRAMES CÔ LẬP NGUYÊN TỬ ─── */
            
            /* Khói bay */
            @keyframes rise_${nodeId} {
                0% {
                    transform: translate(-50%, 0) scale(0.4);
                    opacity: 0;
                }
                30% {
                    opacity: 0.7;
                }
                60% {
                    opacity: 0.4;
                }
                100% {
                    /* Khống chế khói bay trong tầm 60px để tránh tràn khung chứa cha */
                    transform: translate(-50%, -60px) scale(1.2);
                    opacity: 0;
                }
            }

            /* Sửa bug rung lắc: Giữ nguyên gốc translateX(-50%) của cha */
            @keyframes shake_${nodeId} {
                0% { transform: scale(1) rotate(0deg); }
                25% { transform: scale(1) translateX(-4px) translateY(-2px) rotate(-2deg); }
                50% { transform: scale(1) rotate(0deg); }
                75% { transform: scale(1) translateX(4px) translateY(-2px) rotate(2deg); }
                100% { transform: scale(1) rotate(0deg); }
            }

            /* Đổi màu thân ly */
            @keyframes cupPulse_${nodeId} {
                0%, 100% { background-color: #5b4022cb; }
                50% { background-color: #5b4022ae; } /* Tinh chỉnh lại mã màu để không bị biến thành màu xám trắng lỗi */
            }

            /* Hiệu ứng nước cà phê phát sáng nhẹ */
            @keyframes coffeeGlow_${nodeId} {
                0%, 100% { background: #da8920ca; }
                50% { background: #fed197d5; }
            }
        `
    };
}