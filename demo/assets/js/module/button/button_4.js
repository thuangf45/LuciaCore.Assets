export function render(node) {
    const nodeId = node._runtimeId; 

    const dataIdAttr = node.id ? `data-id="${node.id}"` : '';
    const dataParamsAttr = node.params ? `data-params='${JSON.stringify(node.params)}'` : '';
    const actionAttr = node.action ? `data-action="${node.action}"` : '';
    
    // Bốc nhãn nút từ dữ liệu động, fallback mặc định nhỏ gọn
    const label = node.label || 'Buy Now';
    const action = node.action || '';

    return {
        html: `
            <button class="lucia-button ${node.class || ''}" id="${nodeId}" ${actionAttr} ${dataParamsAttr} ${dataIdAttr}>
                ${label}
            </button>
        `,
        css: `
            /* ─── NÚT BẤM 3D KHỐI ĐÓNG BĂNG LIGHT BASE TĨNH ─── */
            #${nodeId} {
                position: relative;
                display: inline-block;
                cursor: pointer;
                outline: none;
                border: 0;
                vertical-align: middle;
                text-decoration: none;
                font-family: system-ui, -apple-system, sans-serif;
                
                /* Gọt kích thước chuẩn hình học */
                font-size: 0.8rem;
                font-weight: 600;
                text-transform: uppercase;
                padding: 0.8em 1.6em;
                width: auto;
                border-radius: 0.6em;
                
                /* 🌟 ÉP MÀU LIGHT MODE TĨNH: Mặt nút đen carbon, chữ trắng */
                background: #111827;
                color: #ffffff;
                
                transform-style: preserve-3d;
                transition: transform 150ms cubic-bezier(0, 0, 0.58, 1), background 150ms ease;
                
                /* Bẫy bảo hiểm lớp không gian */
                z-index: 1;
                
                ${node.style || ''}
            }

            /* 🌟 ĐỘNG CƠ ĐẬP KHỐI ĐẾ 3D PHÍA DƯỚI TĨNH */
            #${nodeId}::before {
                position: absolute;
                content: '';
                width: 100%; height: 100%;
                top: 0; left: 0; right: 0; bottom: 0;
                border-radius: inherit;
                
                /* Khối đế dày dặn được khóa cứng màu xám đen cực đậm (#090d16) để tạo chiều sâu đổ bóng */
                box-shadow: 0 0 0 2px #111827, 0 0.35em 0 0 #090d16;
                background: #090d16;
                
                transform: translate3d(0, 0.35em, -1em);
                transition: transform 150ms cubic-bezier(0, 0, 0.58, 1), box-shadow 150ms cubic-bezier(0, 0, 0.58, 1), background 150ms ease;
            }

            /* ─── TRẠNG THÁI HOVER: LÚN NHẸ MẶT NÚT, NỀN HƠI SÁNG LÊN ĐỂ TƯƠNG PHẢN NỀN TRẮNG ─── */
            #${nodeId}:hover {
                background: #1f2937; /* Chuyển nhẹ sang xám đen Slate khi hover */
                color: #ffffff;
                
                transform: translate(0, 0.12em);
            }

            #${nodeId}:hover::before {
                /* Ép khối đế điều chỉnh lại tọa độ tương xứng với độ lún mặt nút */
                background: #090d16;
                box-shadow: 0 0 0 2px #1f2937, 0 0.23em 0 0 #090d16;
                transform: translate3d(0, 0.23em, -1em);
            }

            /* ─── TRẠNG THÁI ACTIVE: SỤP KHỐI PHẲNG LỲ KHI CLICK CHUỘT ─── */
            #${nodeId}:active {
                background: #111827;
                color: #ffffff;
                transform: translate(0em, 0.35em);
            }

            #${nodeId}:active::before {
                background: #090d16;
                box-shadow: 0 0 0 2px #111827, 0 0 #090d16;
                transform: translate3d(0, 0, -1em);
            }
        `
    };
}