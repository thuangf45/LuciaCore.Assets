export async function render(node) {
    const nodeId = node._runtimeId;

    const dataIdAttr = node.id ? `data-id="${node.id}"` : '';
    const dataParamsAttr = node.params ? `data-params='${JSON.stringify(node.params)}'` : '';
    const actionAttr = node.action ? `data-action="${node.action}"` : '';

    // Bốc dữ liệu động từ bản vẽ JSON
    const label = node.label || 'Buy BTC';
    const action = node.action || '';

    // MẬT MÃ VECTOR BITCOIN ĐỘC NHẤT - Khóa cứng màu vàng kim nguyên thủy
    const btcSvgPath = `<svg viewBox="0 0 24 24" fill="#ea8b19" xmlns="http://www.w3.org/2000/svg"><path d="M14.24 10.56C13.93 11.8 12 11.17 11.4 11L11.95 8.82C12.57 9 14.56 9.26 14.24 10.56M11.13 12.12L10.53 14.53C11.27 14.72 13.56 15.45 13.9 14.09C14.26 12.67 11.87 12.3 11.13 12.12M21.7 14.42C20.36 19.78 14.94 23.04 9.58 21.7C4.22 20.36 .963 14.94 2.3 9.58C3.64 4.22 9.06 .964 14.42 2.3C19.77 3.64 23.03 9.06 21.7 14.42M14.21 8.05L14.66 6.25L13.56 6L13.12 7.73C12.83 7.66 12.54 7.59 12.24 7.53L12.68 5.76L11.59 5.5L11.14 7.29C10.9 7.23 10.66 7.18 10.44 7.12L10.44 7.12L8.93 6.74L8.63 7.91C8.63 7.91 9.45 8.1 9.43 8.11C9.88 8.22 9.96 8.5 9.94 8.75L8.71 13.68C8.66 13.82 8.5 14 8.21 13.95C8.22 13.96 7.41 13.75 7.41 13.75L6.87 15L8.29 15.36C8.56 15.43 8.82 15.5 9.08 15.56L8.62 17.38L9.72 17.66L10.17 15.85C10.47 15.93 10.76 16 11.04 16.08L10.59 17.87L11.69 18.15L12.15 16.33C14 16.68 15.42 16.54 16 14.85C16.5 13.5 16 12.7 15 12.19C15.72 12 16.26 11.55 16.41 10.57C16.61 9.24 15.59 8.53 14.21 8.05Z"></path></svg>`;

    return {
        html: `
            <button id="${nodeId}" class="lucia-button ${node.class || ''}" ${actionAttr} ${dataParamsAttr} ${dataIdAttr}>
                <span class="lucia-btc-box">
                    ${label}
                    <div class="lucia-star btc-star-1">${btcSvgPath}</div>
                    <div class="lucia-star btc-star-2">${btcSvgPath}</div>
                    <div class="lucia-star btc-star-3">${btcSvgPath}</div>
                    <div class="lucia-star btc-star-4">${btcSvgPath}</div>
                    <div class="lucia-star btc-star-5">${btcSvgPath}</div>
                    <div class="lucia-star btc-star-6">${btcSvgPath}</div>
                </span>
            </button>
        `,

        css: `
            /* 1. KHUNG CHỊU LỰC GỐC CỦA BUTTON - ÉP ĐỒNG BỘ THEO MÀU CARBON TĨNH */
            #${nodeId} {
                /* Kết hợp mượt mà giữa màu Đen Tĩnh của hệ thống (#111827) và màu vàng Bitcoin (#ea8b19) */
                background: linear-gradient(30deg, #111827 35%, #1f2937 75%);
                position: relative;
                cursor: pointer;
                border: 2px solid #111827;
                border-radius: 6px; 
                padding: 0; 
                display: inline-flex;
                align-items: center;
                justify-content: center;
                box-sizing: border-box;
                
                width: auto;
                min-width: 120px; 
                height: 42px;
                
                overflow: visible; 
                backface-visibility: hidden;
                transition: transform 0.2s ease, box-shadow 0.3s ease, filter 0.3s ease;
                
                ${node.style || ''}
            }

            /* HOVER BUTTON: KÍCH SÁNG ĐỔ BÓNG VÀNG KIM TRÊN NỀN SÁNG */
            #${nodeId}:hover {
                filter: brightness(1.1);
                box-shadow: 0 4px 20px rgba(234, 139, 25, 0.35); /* Đổ bóng vàng cam mịn màng nổi bật trên nền trắng */
            }

            #${nodeId}:active {
                transform: scale(0.98);
            }

            /* 2. VỎ BỌC CHỨA CHỮ (THE BOX) */
            #${nodeId} .lucia-btc-box {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                box-sizing: border-box;
                width: 100%;
                height: 100%;
                padding: 6px 12px; 
                color: #ffffff !important; 
                
                font-family: system-ui, -apple-system, sans-serif;
                font-size: 0.8rem; 
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.03em;
                position: relative;
                transition: color 0.3s ease, text-shadow 0.3s ease;
            }

            /* HOVER: Chuyển màu chữ sang vàng cam rực rỡ để match với hiệu ứng xu bay */
            #${nodeId}:hover .lucia-btc-box {
                color: #ea8b19 !important;
                text-shadow: 0 0 4px rgba(234, 139, 25, 0.2);
            }

            /* 3. ĐỘNG LỰC HỌC ĐỐNG XU BITCOIN TĨNH */
            #${nodeId} .lucia-star {
                position: absolute;
                color: #ea8b19 !important; 
                z-index: -1; 
                opacity: 0;
                visibility: hidden;
                height: auto;
                will-change: transform, top, left, opacity;
            }

            /* Tọa độ ẩn nấp ban đầu */
            #${nodeId} .btc-star-1 { top: 25%; left: 25%; width: 16px; transition: all 0.8s cubic-bezier(0.05, 0.83, 0.43, 0.96); }
            #${nodeId} .btc-star-2 { top: 40%; left: 45%; width: 12px; transition: all 0.8s cubic-bezier(0, 0.4, 0, 1.01); }
            #${nodeId} .btc-star-3 { top: 35%; left: 35%; width: 5px;  transition: all 0.8s cubic-bezier(0, 0.4, 0, 1.01); }
            #${nodeId} .btc-star-4 { top: 25%; left: 35%; width: 8px;  transition: all 0.7s cubic-bezier(0, 0.4, 0, 1.01); }
            #${nodeId} .btc-star-5 { top: 30%; left: 40%; width: 12px; transition: all 0.6s cubic-bezier(0, 0.4, 0, 1.01); }
            #${nodeId} .btc-star-6 { top: 10%; left: 45%; width: 6px;  transition: all 0.7s ease; }

            /* HOVER PHÓNG XU VÀNG KIM CHUẨN CỰ LÝ */
            #${nodeId}:hover .lucia-star {
                opacity: 1;
                visibility: visible;
                z-index: 2; 
                filter: drop-shadow(0 2px 6px rgba(234, 139, 25, 0.6));
            }

            /* Quỹ đạo văng của xu bao quanh nút */
            #${nodeId}:hover .btc-star-1 { top: -75%;  left: -25%; width: 20px; }
            #${nodeId}:hover .btc-star-2 { top: -35%;  left: -5%;  width: 15px; }
            #${nodeId}:hover .btc-star-3 { top: 65%;   left: 10%;  width: 9px;  }
            #${nodeId}:hover .btc-star-4 { top: 55%;   left: 80%;  width: 12px; }
            #${nodeId}:hover .btc-star-5 { top: -15%;  left: 95%;  width: 18px; }
            #${nodeId}:hover .btc-star-6 { top: -20%;  left: 60%;  width: 12px; }

            /* 4. HIỆU ỨNG CHẠY VIỀN CHỚP CẠNH KHI HOVER */
            #${nodeId}::before, #${nodeId}::after {
                position: absolute;
                content: '';
                left: 0;
                width: 100%;
                box-sizing: border-box;
                border: 2px solid transparent;
                transition: all 0.3s ease;
            }
            #${nodeId}::before { bottom: 0; height: 0; border-bottom: 2px solid transparent; border-left: 2px solid transparent; }
            #${nodeId}::after { top: 0; height: 0; border-top: 2px solid transparent; border-right: 2px solid transparent; }

            /* Chớp viền trắng và vàng cam xé gió cực kỳ tinh tế */
            #${nodeId}:hover::before { height: 100%; border-color: #ffffff; }
            #${nodeId}:hover::after { height: 100%; border-color: #ea8b19; }
        `
    };
}