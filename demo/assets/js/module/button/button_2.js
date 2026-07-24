export async function render(node) {
    const nodeId = node._runtimeId;

    const dataIdAttr = node.id ? `data-id="${node.id}"` : '';
    const dataParamsAttr = node.params ? `data-params='${JSON.stringify(node.params)}'` : '';
    const actionAttr = node.action ? `data-action="${node.action}"` : '';

    // Bốc dữ liệu động từ bản vẽ JSON, fallback an toàn nếu admin không điền
    const label = node.label || 'Buy Now';
    const priceText = "Price: " + (node.price !== undefined ? node.price : '$0');
    const action = node.action || '';

    return {
        html: `
            <div id="${nodeId}" class="lucia-button ${node.class || ''}" data-tooltip="${priceText}" ${actionAttr} ${dataParamsAttr} ${dataIdAttr}>
                <div class="lucia-btn-wrapper">
                    <div class="lucia-btn-text">${label}</div>
                    <span class="lucia-btn-icon">
                        <svg viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5zM3.14 5l1.25 5h8.22l1.25-5H3.14zM5 13a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0zm9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0z"></path>
                        </svg>
                    </span>
                </div>
            </div>
        `,

        css: `
            /* 1. KHUNG CHỊU LỰC CHÍNH CỦA NÚT BẤM - ÉP MÀU CARBON TĨNH */
            #${nodeId} {
                position: relative;
                cursor: pointer;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                box-sizing: border-box;
                
                /* Đập tan kích thước chết - nương theo dòng chảy Flexbox */
                width: auto;
                min-width: 120px; 
                height: 42px;
                padding: 0 20px;
                border-radius: 6px;
                
                /* Đóng băng hệ màu Light Mode: Nút đen tinh tế */
                background-color: #111827;
                font-family: system-ui, -apple-system, sans-serif;
                font-size: 0.95rem;
                font-weight: 500;
                
                overflow: visible; /* Bắt buộc để hở để Tooltip bay lên không bị vách hộp cha cắt cụt */
                backface-visibility: hidden;
                will-change: background-color;
                transition: background-color 0.2s ease;
                
                ${node.style || ''}
            }

            /* HOVER LÀM SÁNG NÚT BẤM TĨNH */
            #${nodeId}:hover {
                filter: brightness(1.2);
            }

            /* ĐÓNG GÓI RUỘT CHUYỂN ĐỘNG */
            #${nodeId} .lucia-btn-wrapper {
                position: relative;
                width: 100%;
                height: 100%;
                overflow: hidden;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            /* XỬ LÝ TEXT VÀ ICON GIỎ HÀNG TRƯỢT SỤP */
            #${nodeId} .lucia-btn-text,
            #${nodeId} .lucia-btn-icon {
                position: absolute;
                width: 100%;
                height: 100%;
                left: 0;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                color: #ffffff; /* Luôn giữ chữ màu trắng tương phản */
                transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                will-change: transform;
            }

            #${nodeId} .lucia-btn-text { top: 0; transform: translateY(0); }
            #${nodeId} .lucia-btn-icon { top: 0; transform: translateY(100%); } /* Giấu icon nằm chìm dưới đáy */

            #${nodeId} .lucia-btn-icon svg { width: 20px; height: 20px; }

            /* KÍCH NỔ HOVER TRƯỢT BLOCK */
            #${nodeId}:hover .lucia-btn-text { transform: translateY(-100%); }
            #${nodeId}:hover .lucia-btn-icon { transform: translateY(0); }

            /* 🌟 2. CƠ KHÍ ĐỘNG HỌC TOOLTIP TĨNH (NỔI BẬT TRÊN NỀN TRẮNG DỰ ÁN) */
            
            /* Khối hộp Tooltip hiện chữ giá */
            #${nodeId}::before {
                position: absolute;
                content: attr(data-tooltip);
                padding: 6px 12px;
                white-space: nowrap;
                background-color: #1f2937; /* Ép cứng màu xám đen anthracite cho khối lơ lửng */
                color: #ffffff;            /* Chữ trắng nổi bật */
                font-size: 0.8rem;
                font-weight: 600;
                border-radius: 4px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); /* Tăng shadow độ phủ rộng để thấy chiều sâu trên nền Light */
                
                /* Tọa độ điểm xuất phát bay lơ lửng */
                bottom: 100%;
                left: 50%;
                transform: translate(-50%, -8px) scale(0.95);
                
                opacity: 0;
                visibility: hidden;
                transition: transform 0.2s ease, opacity 0.2s ease;
                will-change: transform, opacity;
            }

            /* Mũi tên tam giác chỉa xuống nút bấm */
            #${nodeId}::after {
                position: absolute;
                content: '';
                width: 0;
                height: 0;
                border: 6px solid transparent;
                border-top-color: #1f2937; /* Đồng bộ màu với hộp bên trên */
                
                bottom: 100%;
                left: 50%;
                transform: translate(-50%, 4px);
                
                opacity: 0;
                visibility: hidden;
                transition: transform 0.2s ease, opacity 0.2s ease;
                will-change: transform, opacity;
            }

            /* KÍCH NỔ HOVER TOOLTIP: HIỆN HÌNH VÀ PHÌNH NHẸ */
            #${nodeId}:hover::before {
                opacity: 1;
                visibility: visible;
                transform: translate(-50%, -12px) scale(1);
            }
            #${nodeId}:hover::after {
                opacity: 1;
                visibility: visible;
                transform: translate(-50%, 0);
            }
        `
    };
}