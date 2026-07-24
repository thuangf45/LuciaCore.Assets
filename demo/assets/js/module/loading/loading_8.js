export function render(node) {
    const nodeId = node._runtimeId;     

    return {
        html: `
            <div id="${nodeId}" class="lucia-gooey-wrapper" style="${node.style || ''}">
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" class="lucia-gooey-filter-svg">
                    <defs>
                        <filter id="goo_${nodeId}">
                            <feGaussianBlur result="blur" stdDeviation="10" in="SourceGraphic"></feGaussianBlur>
                            <feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 21 -7" mode="matrix" in="blur"></feColorMatrix>
                        </filter>
                    </defs>
                </svg>
                
                <div class="gooey-container" data-action="${node.action || ''}">
                    <div class="dot dot-1"></div>
                    <div class="dot dot-2"></div>
                    <div class="dot dot-3"></div>
                </div>
            </div>
        `,
        css: `
            #${nodeId}.lucia-gooey-wrapper {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                height: fit-content;
                padding: 40px;
                box-sizing: border-box;
            }

            #${nodeId} .lucia-gooey-filter-svg {
                position: absolute;
                width: 0;
                height: 0;
                pointer-events: none;
            }

            #${nodeId} .gooey-container {
                width: 200px;
                height: 200px;
                position: relative;
                filter: url("#goo_${nodeId}");
                /* ⚡ ĐẨY TỐC ĐỘ: Rút chu kỳ tổng xuống 1.2s giúp hiệu ứng quất nhanh hơn */
                animation: rotate-move_${nodeId} 1.2s ease-in-out infinite;
            }

            #${nodeId} .dot {
                width: 70px;
                height: 70px;
                border-radius: 50%;
                background-color: #000;
                position: absolute;
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;
                margin: auto;
            }

            #${nodeId} .dot-3 {
                background-color: #ff1717;
                animation: dot-3-move_${nodeId} 1.2s ease infinite, index_${nodeId} 3.6s ease infinite;
            }

            #${nodeId} .dot-2 {
                background-color: #0051ff;
                animation: dot-2-move_${nodeId} 1.2s ease infinite, index_${nodeId} 3.6s -2.4s ease infinite;
            }

            #${nodeId} .dot-1 {
                background-color: #ffc400;
                animation: dot-1-move_${nodeId} 1.2s ease infinite, index_${nodeId} 3.6s -1.2s ease infinite;
            }

            /* ─── HỆ THỐNG KEYFRAMES KHỬ ĐỘ TRỄ (ZERO-LAG TIMELINE) ─── */
            
            /* Giọt 3: Búng thẳng lên trên lập tức */
            @keyframes dot-3-move_${nodeId} {
                0% { transform: translateY(0px) scale(1); }
                10% { transform: scale(1); }
                30% { transform: translateY(-25px) scale(0.45); } /* Gia tốc đoạn đầu */
                50% { transform: translateY(-90px) scale(0.45); } /* Đạt đỉnh tách khối cực đại tại 50% */
                75% { transform: translateY(-90px) scale(0.45); } 
                100% { transform: translateY(0px) scale(1); }
            }

            /* Giọt 2: Búng chéo xuống trái lập tức */
            @keyframes dot-2-move_${nodeId} {
                0% { transform: translate(0px, 0px) scale(1); }
                10% { transform: scale(1); }
                30% { transform: translate(-22px, 16px) scale(0.45); }
                50% { transform: translate(-80px, 60px) scale(0.45); } /* Đạt đỉnh tách khối cực đại tại 50% */
                75% { transform: translate(-80px, 60px) scale(0.45); }
                100% { transform: translateY(0px) scale(1); }
            }

            /* Giọt 1: Búng chéo xuống phải lập tức */
            @keyframes dot-1-move_${nodeId} {
                0% { transform: translate(0px, 0px) scale(1); }
                10% { transform: scale(1); }
                30% { transform: translate(22px, 16px) scale(0.45); }
                50% { transform: translate(80px, 60px) scale(0.45); } /* Đạt đỉnh tách khối cực đại tại 50% */
                75% { transform: translate(80px, 60px) scale(0.45); }
                100% { transform: translateY(0px) scale(1); }
            }

            /* Xoay cụm trục: Kích hoạt xoay sớm từ mốc 35% thay vì ngâm đến 55% */
            @keyframes rotate-move_${nodeId} {
                0%, 10% { transform: rotate(0deg); }
                35% { transform: rotate(0deg); }
                70%, 100% { transform: rotate(360deg); }
            }

            /* Đồng bộ lại timeline quản lý chiều sâu z-index */
            @keyframes index_${nodeId} {
                0%, 100% { z-index: 3; }
                33.3% { z-index: 2; }
                66.6% { z-index: 1; }
            }
        `
    };
}