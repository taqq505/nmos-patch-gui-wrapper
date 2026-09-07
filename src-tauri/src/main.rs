// NMOS Patch GUI Wrapper — Copyright (c) 2026 taqq505
// https://github.com/taqq505/nmos-patch-gui-wrapper

#![cfg_attr(all(not(debug_assertions), target_os = "windows"), windows_subsystem = "windows")]

fn main() {
    tauri::Builder::default()
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
