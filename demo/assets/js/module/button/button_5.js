export function render(node) {
    const nodeId = node._runtimeId;

    const dataIdAttr = node.id ? `data-id="${node.id}"` : '';
    const dataParamsAttr = node.params ? `data-params='${JSON.stringify(node.params)}'` : '';
    const actionAttr = node.action ? `data-action="${node.action}"` : '';

    // Bốc dữ liệu động từ bản vẽ JSON, fallback mặc định nhỏ gọn phù hợp lưới hàng hóa
    const label = node.label || 'Buy Now';
    const action = node.action || '';

    return {
        html: `
            <button class="lucia-button ${node.class || ''}" id="${nodeId}" ${actionAttr} ${dataParamsAttr} ${dataIdAttr}>
                <svg viewBox="0 0 16 16" class="lucia-btn-icon" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                    <path d="M11.354 6.354a.5.5 0 0 0-.708-.708L8 8.293 6.854 7.146a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0l3-3z"></path>
                    <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1H.5zm3.915 10L3.102 4h10.796l-1.313 7h-8.17zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"></path>
                </svg>
                <p class="lucia-btn-text">${label}</p>
            </button>
        `,
        css: `
            /* ─── NÚT OUTLINE ĐẢO TRỤC MÀU LIGHT BASE TĨNH ─── */
            #${nodeId} {
                display: inline-flex;
                min-width: 120px;
                height: 42px;
                justify-content: center;
                align-items: center;
                padding: 0 20px;
                gap: 10px;
                border-radius: 6px;
                border: none;
                cursor: pointer;
                box-sizing: border-box;
                font-family: system-ui, -apple-system, sans-serif;
                font-size: 0.95rem;
                font-weight: 500;
                width: auto;
                
                /* 🌟 ÉP NỀN NÚT GỐC TĨNH: Màu đen carbon sang trọng */
                background-color: #111827;
                
                /* 🌟 KHUNG OUTLINE: Ép khung 2px ép vào trong ăn theo màu đen carbon */
                outline: 2px #111827 solid;
                outline-offset: -2px;
                
                transition: background-color 300ms ease, outline-color 300ms ease;
                ${node.style || ''}
            }

            /* Ruột chữ mặc định: Đóng cứng màu trắng tương phản tuyệt đối trên nền đen */
            #${nodeId} .lucia-btn-text {
                margin: 0; padding: 0;
                color: #ffffff;
                font-weight: 700;
                transition: color 300ms ease;
            }

            /* Icon SVG mặc định: Ăn theo màu trắng đồng bộ */
            #${nodeId} svg {
                width: 16px; height: 16px;
                color: #ffffff;
                transition: color 300ms ease;
            }

            #${nodeId} svg path {
                fill: currentColor;
            }

            /* ─── HIỆU ỨNG HOVER PHẲNG: BIẾN THÀNH OUTLINE TRONG SUỐT TRÊN NỀN TRẮNG ─── */
            #${nodeId}:hover {
                /* Xả rỗng nền mặt nút để lộ nền trắng của trang web */
                background-color: transparent;
            }

            #${nodeId}:hover .lucia-btn-text {
                /* Chữ lật ngược trục sang màu đen carbon để nổi bật trên nền trắng */
                color: #111827;
            }

            #${nodeId}:hover svg {
                /* Icon SVG lật ngược trục sang màu đen carbon đồng bộ */
                color: #111827;
            }

            /* Trạng thái active phản hồi cơ học nhún nhẹ */
            #${nodeId}:active {
                transform: scale(0.98);
                opacity: 0.9;
            }
        `
    };
}