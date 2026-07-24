export function execute(e, context) {
    console.log(`[LuciaCore] Hành động mua hàng được kích hoạt từ phần tử: ${e.target.id}`);
    alert(`Bạn đã kích hoạt hành động mua hàng từ phần tử: ${e.target.id}`);
}