export function render(node) {
    const nodeId = node._runtimeId; 
    
    return {
        html: `
            <div id="${nodeId}" class="lucia-spinner-wrapper">
                <div class="spinner" data-action="${node.action || ''}"></div>
            </div>
        `,
        css: `
            #${nodeId}.lucia-spinner-wrapper {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                height: fit-content;
                padding: 20px;
                box-sizing: border-box;
                ${node.style || ''}
            }

            #${nodeId} .spinner {
                width: 46px;
                height: 46px;
                display: grid;
                animation: spinner-plncf9_${nodeId} 3s infinite;
            }

            #${nodeId} .spinner::before,
            #${nodeId} .spinner::after {
                content: "";
                grid-area: 1/1;
                border: 9px solid;
                border-radius: 50%;
                border-color: #000 #000 #0000 #0000;
                mix-blend-mode: darken;
                animation: spinner-plncf9_${nodeId} 1s infinite linear;
            }

            #${nodeId} .spinner::after {
                border-color: #0000 #0000 #dbdcef #dbdcef;
                animation-direction: reverse;
            }

            @keyframes spinner-plncf9_${nodeId} {
                100% {
                    transform: rotate(1turn);
                }
            }
        `
    };
}