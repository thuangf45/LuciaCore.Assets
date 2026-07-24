export function render(node) {
    const nodeId = node._runtimeId; 

    return {
        html: `
            <div id="${nodeId}" class="lucia-spinner-wrapper" style="${node.style || ''}">
                <div class="lucia-radial-spinner" data-action="${node.action || ''}"></div>
            </div>
        `,
        css: `
            /* Khung gánh tải hệ thống, xử lý căn giữa bằng Flexbox */
            #${nodeId}.lucia-spinner-wrapper {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                height: fit-content;
                padding: 30px;
                box-sizing: border-box;
            }

            #${nodeId} .lucia-radial-spinner {
                width: 56px;
                height: 56px;
                display: grid;
                color: #004dff;
                background: radial-gradient(farthest-side, currentColor calc(100% - 7px), #0000 calc(100% - 6px) 0);
                -webkit-mask: radial-gradient(farthest-side, #0000 calc(100% - 15px), #000 calc(100% - 13px));
                mask: radial-gradient(farthest-side, #0000 calc(100% - 15px), #000 calc(100% - 13px)); /* Thêm mask chuẩn để tương thích đa trình duyệt */
                border-radius: 50%;
                animation: spinner-rotate_${nodeId} 2s infinite linear;
            }

            #${nodeId} .lucia-radial-spinner::before,
            #${nodeId} .lucia-radial-spinner::after {
                content: "";
                grid-area: 1/1;
                background: linear-gradient(currentColor 0 0) center,
                            linear-gradient(currentColor 0 0) center;
                background-size: 100% 11px, 11px 100%;
                background-repeat: no-repeat;
            }

            #${nodeId} .lucia-radial-spinner::after {
                transform: rotate(45deg);
            }

            /* ─── HỆ THỐNG KEYFRAMES CÔ LẬP TUYỆT ĐỐI ─── */
            @keyframes spinner-rotate_${nodeId} {
                100% {
                    transform: rotate(1turn);
                }
            }
        `
    };
}