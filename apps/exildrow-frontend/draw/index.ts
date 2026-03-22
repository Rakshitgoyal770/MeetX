export function drawCanvus(canvus : HTMLCanvasElement) {

    const ctx = canvus.getContext("2d");
            
    if(!ctx) {
        return
    }

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvus.width, canvus.height);
        
    let clicked = false;
    let startX = 0;
    let startY = 0;
            
    canvus.addEventListener("mousedown", (e) => {
        clicked = true;
        startX = e.clientX;
        startY = e.clientY;
        console.log(startX, startY);
    })

    canvus.addEventListener("mouseup", (e) => {
        clicked = false;
        console.log(e.clientX, e.clientY);
    })

    canvus.addEventListener("mousemove", (e) => {
        if(clicked) {
            const width = e.clientX - startX;
            const height = e.clientY - startY;
            ctx.clearRect(0, 0, canvus.width, canvus.height);
            ctx.fillStyle = "rgba(0, 0, 0, 0)";
            ctx.fillRect(0, 0, canvus.width, canvus.height);
            ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
            ctx.strokeRect(startX, startY, width, height);
        }
    });
}