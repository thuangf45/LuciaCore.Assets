export async function render(node) {
    const nodeId = node._runtimeId; 

    const dataIdAttr = node.id ? `data-id="${node.id}"` : '';
    const dataParamsAttr = node.params ? `data-params='${JSON.stringify(node.params)}'` : '';
    const actionAttr = node.action ? `data-action="${node.action}"` : '';

    return {
        html: `
            <button
                id="${nodeId}"
                class = "lucia-button ${node.class || ''}"
                ${actionAttr}
                ${dataParamsAttr}
                ${dataIdAttr}>
                ${node.label || 'Button'}
            </button>
        `,

        css: `
            #${nodeId}
            {
                /* 1. Reset & Định hình hộp */
                cursor: pointer;
                border: none;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                box-sizing: border-box;
                
                /* CHỐT BẢO VỆ FLEXBOX: Tự dãn phẳng khi cha ép stretch dọc, tự thu mình khi nằm hàng ngang */
                width: auto; 
                flex-grow: 0;          
                flex-shrink: 1;        
                
                /* 2. Kích thước chuẩn thiết kế (Giữ mục tiêu an toàn cho ngón tay) */
                padding: 10px 20px;
                min-height: 40px;
                border-radius: 6px;
                
                /* 3. Phông chữ chuẩn chỉ & Chống tràn chữ trên Mobile */
                font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                font-size: 0.95rem;
                font-weight: 500;
                line-height: 1;
                letter-spacing: -0.01em;
                text-align: center;
                white-space: normal;   
                word-break: break-word;

                /* 🌟 4. ÉP CỨNG ĐỒNG BỘ THEO LIGHT BASE (PRIMARY COLOR = BLACK) */
                background-color: #111827; /* Màu đen carbon/xám đậm chuyên nghiệp thay cho đen tuyền */
                color: #ffffff;            /* Chữ trắng tương phản tuyệt đối */
                
                /* 5. Kháng lỗi phần cứng GPU khi ép scale nhỏ */
                backface-visibility: hidden;
                will-change: transform, opacity;
                
                /* 6. Mạch động lực học */
                transition:
                    background-color 0.15s ease,
                    opacity 0.15s ease,
                    transform 0.1s cubic-bezier(0.4, 0, 0.2, 1);

                /* 7. Để user/AI tự custom đè trực tiếp bằng style tĩnh từ JSON (Ví dụ: "background-color: #ef4444" nếu muốn làm nút hủy) */
                ${node.style || ''}
            }

            /* Trạng thái Hover: Vì nền gốc là màu tối (#111827) nên dùng opacity nhẹ hoặc tăng sáng đều mịn */
            #${nodeId}:hover
            {
                filter: brightness(1.2); /* Tăng độ sáng để thấy nút chuyển sang xám nhẹ khi hover */
                transform: translateY(-1px); 
            }

            /* Trạng thái Active: Nún nhẹ nút xuống */
            #${nodeId}:active
            {
                filter: brightness(0.9);
                transform: translateY(0) scale(0.98); 
            }
            
            /* Trạng thái Focus */
            #${nodeId}:focus-visible 
            {
                outline: 2px solid #111827; /* Đường viền focus đồng bộ với màu nút gốc */
                outline-offset: 2px;
            }
        `
    };
}