export function render(node) {
    const nodeId = node._runtimeId;

    const dataIdAttr = node.id ? `data-id="${node.id}"` : '';
    const dataParamsAttr = node.params ? `data-params='${JSON.stringify(node.params)}'` : '';
    const actionAttr = node.action ? `data-action="${node.action}"` : '';

    // Bốc nhãn nút từ dữ liệu động, fallback mặc định nhỏ gọn
    const label = node.label || 'Buy Ticket';
    const action = node.action || '';

    return {
        html: `
            <a class="lucia-button ${node.class || ''}" id="${nodeId}" ${actionAttr} ${dataParamsAttr} ${dataIdAttr}>
                <span class="top-key"></span>
                <span class="text">${label}</span>
                <span class="bottom-key-1"></span>
                <span class="bottom-key-2"></span>
            </a>
        `,
        css: `
            /* ─── KHUNG NỀN CYBERPUNK FANCY LIGHT MODE ─── */
            #${nodeId} {
                background-color: transparent;
                border: 2px solid #111827; /* Viền đen carbon chuyên nghiệp */
                border-radius: 0;
                box-sizing: border-box;
                color: #111827;            /* Chữ đen đồng bộ viền */
                cursor: pointer;
                display: inline-block;
                font-weight: 700;
                letter-spacing: 0.05em;
                margin: 0;
                outline: none;
                overflow: visible;
                
                /* Kích thước gọn gàng */
                padding: 1em 1.25em;
                font-size: 0.65rem;
                
                position: relative;
                text-align: center;
                text-decoration: none;
                text-transform: uppercase;
                transition: all 0.3s ease-in-out;
                user-select: none;
                width: auto;
                ${node.style || ''}
            }

            /* Thanh ngang chỉ thị nằm bên trái chữ */
            #${nodeId}::before {
                content: " ";
                width: 1rem;
                height: 2px;
                background: #111827; /* Đồng bộ màu text */
                top: 50%;
                left: 1em;
                position: absolute;
                transform: translateY(-50%);
                transform-origin: center;
                transition: background 0.3s linear, width 0.3s linear;
            }

            #${nodeId} .text {
                font-family: system-ui, -apple-system, sans-serif;
                font-size: 1.1em;
                line-height: 1.2;
                padding-left: 1.4em; 
                display: block;
                text-align: left;
                transition: all 0.3s ease-in-out;
                color: #111827;
            }

            /* 🌟 ĐỘNG CƠ CẮT GÓC TĨNH: Ép cứng màu trùng với nền Light Mode (#ffffff) để che viền tạo rãnh */
            #${nodeId} .top-key {
                height: 2px;
                width: 1rem; 
                top: -2px;
                left: 0.5rem;
                position: absolute;
                background: #ffffff; /* Cắt đứt viền đen bằng màu nền trắng */
                transition: width 0.5s ease-out, left 0.3s ease-out, background 0.3s ease;
            }

            #${nodeId} .bottom-key-1 {
                height: 2px;
                width: 1rem; 
                right: 1.2rem;
                bottom: -2px;
                position: absolute;
                background: #ffffff; /* Cắt đứt viền đen dưới */
                transition: width 0.5s ease-out, right 0.3s ease-out, background 0.3s ease;
            }

            #${nodeId} .bottom-key-2 {
                height: 2px;
                width: 0.4rem; 
                right: 0.5rem;
                bottom: -2px;
                position: absolute;
                background: #ffffff; /* Cắt đứt viền đen dưới */
                transition: width 0.5s ease-out, right 0.3s ease-out, background 0.3s ease;
            }

            /* ─── HIỆU ỨNG HOVER ĐẢO ẢNH (INVERT) MẠNH MẼ ─── */
            #${nodeId}:hover {
                color: #ffffff;             /* Chữ hóa trắng */
                background: #111827;        /* Nền hóa đen carbon */
            }

            #${nodeId}:hover::before {
                width: 0.6rem;
                background: #ffffff;
            }

            #${nodeId}:hover .text {
                color: #ffffff;
                padding-left: 1em;
            }

            /* Khi hover, nút chuyển nền đen tuyền thì các rãnh cắt phải đổi màu đen để tiệp vào nền nút */
            #${nodeId}:hover .top-key {
                left: -2px;
                width: 0px;
                background: #111827;
            }

            #${nodeId}:hover .bottom-key-1,
            #${nodeId}:hover .bottom-key-2 {
                right: 0;
                width: 0;
                background: #111827;
            }
        `
    };
}