// electron から ipcRenderer を取り出す
const { ipcRenderer } = (window as any).require('electron');
const path = (window as any).require('path');

// HTMLの要素を取得
const openBtn = document.getElementById('openBtn') as HTMLButtonElement;
const viewer = document.getElementById('viewer') as HTMLImageElement;

let imageFiles: string[] = [];
let currentIndex = 0;

/*
fileInput.addEventListener('change', (e: any) => {
    console.log("① ファイル選択イベント発生");
    const files = e.target.files;
    
    if (files && files.length > 0) {
        console.log(`② 選択されたファイル数: ${files.length}`);
        
        imageFiles = Array.from(files)
            .map((f: any) => {
                console.log("チェック中のファイル:", f.name, "パス:", f.path); // ここで1つずつ確認
                return f.path;
            })
            .filter(p => p && /\.(jpg|jpeg|png|gif|webp)$/i.test(p)); // p が存在するかチェック追加
        console.log("③ 抽出された画像パス一覧:", imageFiles);

        if (imageFiles.length === 0) {
            console.error("④ 画像パスが取得できませんでした。");
            return;
        }

        currentIndex = 0;
        displayImage();
    } else {
        console.log("②' ファイルが選択されていません");
    }
});
*/
// ボタンクリック時の処理
openBtn.addEventListener('click', async () => {
    // メインプロセスに処理を依頼
    imageFiles = await ipcRenderer.invoke('open-directory');
    
    if (imageFiles.length > 0) {
        currentIndex = 0;
        displayImage();
    } else {
        alert("画像が見つかりませんでした。");
    }
});

function displayImage() {
    if (imageFiles.length > 0) {
        // Windowsのパス区切り \ を / に変換
        const imagePath = imageFiles[currentIndex].replace(/\\/g, '/');
        viewer.src = `file:///${imagePath}`;
        viewer.style.display = 'inline-block';
    }
}

// 矢印キー操作
window.addEventListener('keydown', (e) => {
    if (imageFiles.length === 0) return;
    if (e.key === 'ArrowRight') {
        currentIndex = (currentIndex + 1) % imageFiles.length;
        displayImage();
    } else if (e.key === 'ArrowLeft') {
        currentIndex = (currentIndex - 1 + imageFiles.length) % imageFiles.length;
        displayImage();
    }
});