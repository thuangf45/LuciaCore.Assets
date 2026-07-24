export function render(node) {
    const nodeId = node._runtimeId; 

    return {
        html: `
            <div id="${nodeId}" class="lucia-atomic-wrapper" style="${node.style || ''}">
                <div class="atomic-container" data-action="${node.action || ''}">
                    <div class="atomic-ring"></div>
                    <div class="atomic-ring"></div>
                    <div class="atomic-ring"></div>
                    <div class="atomic-ring"></div>
                    <div class="atomic-text">loading</div>
                </div>
            </div>
        `,
        css: `
            /* Khung gánh tải hệ thống */
            #${nodeId}.lucia-atomic-wrapper {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                height: fit-content;
                padding: 40px;
                box-sizing: border-box;
            }

            #${nodeId} .atomic-container {
                display: flex;
                justify-content: center;
                align-items: center;
                position: relative;
                width: 200px;
                height: 200px;
            }

            #${nodeId} .atomic-text {
                font-size: 14px;
                font-family: sans-serif;
                font-weight: 500;
                text-transform: uppercase;
                letter-spacing: 1px;
                color: rgb(82, 79, 79);
            }

            /* Sửa toàn bộ ID tĩnh thành Scoped Class nội bộ */
            #${nodeId} .atomic-ring {
                width: 190px;
                height: 190px;
                border: 1px solid transparent;
                border-radius: 50%;
                position: absolute;
            }

            /* ⚡ TĂNG TỐC VÒNG QUAY: Hạ chu kỳ từ 2s xuống 1.1s để tạo hiệu ứng đan khối dồn dập */
            #${nodeId} .atomic-ring:nth-child(1) {
                border-bottom: 8px solid rgb(240, 42, 230);
                animation: atomic-rotate1_${nodeId} 1.1s linear infinite;
            }

            #${nodeId} .atomic-ring:nth-child(2) {
                border-bottom: 8px solid rgb(240, 19, 67);
                animation: atomic-rotate2_${nodeId} 1.1s linear infinite;
            }

            #${nodeId} .atomic-ring:nth-child(3) {
                border-bottom: 8px solid rgb(3, 170, 170);
                animation: atomic-rotate3_${nodeId} 1.1s linear infinite;
            }

            #${nodeId} .atomic-ring:nth-child(4) {
                border-bottom: 8px solid rgb(207, 135, 1);
                animation: atomic-rotate4_${nodeId} 1.1s linear infinite;
            }

            /* ─── HỆ THỐNG KEYFRAMES CÔ LẬP KHÔNG GIAN 3D ─── */
            @keyframes atomic-rotate1_${nodeId} {
                from { transform: rotateX(50deg) rotateZ(110deg); }
                to { transform: rotateX(50deg) rotateZ(470deg); }
            }

            @keyframes atomic-rotate2_${nodeId} {
                from { transform: rotateX(20deg) rotateY(50deg) rotateZ(20deg); }
                to { transform: rotateX(20deg) rotateY(50deg) rotateZ(380deg); }
            }

            @keyframes atomic-rotate3_${nodeId} {
                /* Đảo hướng quay ngược dấu để tạo hiệu ứng giao thoa cắt chéo góc */
                from { transform: rotateX(40deg) rotateY(130deg) rotateZ(450deg); }
                to { transform: rotateX(40deg) rotateY(130deg) rotateZ(90deg); }
            }

            @keyframes atomic-rotate4_${nodeId} {
                from { transform: rotateX(70deg) rotateZ(270deg); }
                to { transform: rotateX(70deg) rotateZ(630deg); }
            }
        `
    };
}