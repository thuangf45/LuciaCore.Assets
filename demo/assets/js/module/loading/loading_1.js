export function render(node) {
    const nodeId = node._runtimeId; 

    return {
        html: `
            <div id="${nodeId}" class="lucia-loader-wrapper">
                <div class="loader" data-action="${node.action || ''}"></div>
            </div>
        `,
        css: `
            #${nodeId}.lucia-loader-wrapper {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                height: fit-content;
                padding: 20px;
                box-sizing: border-box;
                ${node.style || ''}
            }

            #${nodeId} .loader {
                position: relative;
                width: 2.5em;
                height: 2.5em;
                transform: rotate(165deg);
            }

            #${nodeId} .loader::before,
            #${nodeId} .loader::after {
                content: "";
                position: absolute;
                top: 50%;
                left: 50%;
                display: block;
                width: 0.5em;
                height: 0.5em;
                border-radius: 0.25em;
                transform: translate(-50%, -50%);
            }

            #${nodeId} .loader:before {
                animation: before8_${nodeId} 2s infinite;
            }

            #${nodeId} .loader::after {
                animation: after6_${nodeId} 2s infinite;
            }

            @keyframes loader-plncf9_${nodeId} {
                100% {
                    transform: rotate(1turn);
                }
            }

            @keyframes before8_${nodeId} {
                0% {
                    width: 0.5em;
                    box-shadow: 1em -0.5em rgba(225, 20, 98, 0.75), -1em 0.5em rgba(111, 202, 220, 0.75);
                }

                35% {
                    width: 2.5em;
                    box-shadow: 0 -0.5em rgba(225, 20, 98, 0.75), 0 0.5em rgba(111, 202, 220, 0.75);
                }

                70% {
                    width: 0.5em;
                    box-shadow: -1em -0.5em rgba(225, 20, 98, 0.75), 1em 0.5em rgba(111, 202, 220, 0.75);
                }

                100% {
                    box-shadow: 1em -0.5em rgba(225, 20, 98, 0.75), -1em 0.5em rgba(111, 202, 220, 0.75);
                }
            }

            @keyframes after6_${nodeId} {
                0% {
                    height: 0.5em;
                    box-shadow: 0.5em 1em rgba(61, 184, 143, 0.75), -0.5em -1em rgba(233, 169, 32, 0.75);
                }

                35% {
                    height: 2.5em;
                    box-shadow: 0.5em 0 rgba(61, 184, 143, 0.75), -0.5em 0 rgba(233, 169, 32, 0.75);
                }

                70% {
                    height: 0.5em;
                    box-shadow: 0.5em -1em rgba(61, 184, 143, 0.75), -0.5em 1em rgba(233, 169, 32, 0.75);
                }

                100% {
                    box-shadow: 0.5em 1em rgba(61, 184, 143, 0.75), -0.5em -1em rgba(233, 169, 32, 0.75);
                }
            }
        `
    };
}