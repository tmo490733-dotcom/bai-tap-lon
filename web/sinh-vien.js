document.addEventListener("DOMContentLoaded", khoiTaoQuanLySinhVien);
function khoiTaoQuanLySinhVien()
{
    const thanBang = document.getElementById("svBody");
    if (!thanBang) return;
    // ===== 1. DỮ LIỆU VÀ LƯU TRỮ =====
    const KHOA_LUU_SV = "sinhvien_ds"; 
    const SO_DONG_MOI_TRANG = 10;
    const LOP_TRANG_THAI = { "Đang học": "status", "Bảo lưu": "status status-pause", "Thôi học": "status status-stop" };
    const DU_LIEU_MAU = [
        { maSV: "SV001", hoTen: "Nguyễn Văn An", gioiTinh: "Nam", ngaySinh: "2005-03-06", lop: "CNTT1", nganh: "Công nghệ thông tin", email: "an@gmail.com", trangThai: "Đang học" },
        { maSV: "SV002", hoTen: "Trần Thị Bình", gioiTinh: "Nữ", ngaySinh: "2005-05-12", lop: "CNTT1", nganh: "Công nghệ thông tin", email: "binh@gmail.com", trangThai: "Đang học" },
        { maSV: "SV003", hoTen: "Lê Văn Cường", gioiTinh: "Nam", ngaySinh: "2005-09-21", lop: "CNTT2", nganh: "Công nghệ thông tin", email: "cuong@gmail.com", trangThai: "Đang học" }
    ];
    let dsSinhVien = taiDanhSachSinhVien();
    let trangHienTai = 1;
    let maDangSua = null;
    const layPhanTu = function (id) { return document.getElementById(id); };
    function taiDanhSachSinhVien() {
        let ketQua = JSON.parse(JSON.stringify(DU_LIEU_MAU));
        try {
            const chuoiDaLuu = localStorage.getItem(KHOA_LUU_SV);
            if (chuoiDaLuu !== null) {
                ketQua = JSON.parse(chuoiDaLuu);
                if (Array.isArray(daDoc)) ketQua = daDoc;
            }
        } 
        catch (loi) {
            console.log("Không đọc được dữ liệu:", loi);
        }
        return ketQua;
    }

    function luuDanhSachSinhVien() {
        try { localStorage.setItem(KHOA_LUU_SV, JSON.stringify(dsSinhVien)); }
        catch (loi) { console.log("Không lưu được dữ liệu:", loi); }
    }  
    function taiLichSu() {
        let ketQua = [];
        try {
            const chuoiDaLuu = localStorage.getItem(KHOA_LUU_LICH_SU);
            if (chuoiDaLuu !== null) {
                ketQua = JSON.parse(chuoiDaLuu);
            }
        } 
        catch (loi) {
            console.log("Không đọc được lịch sử:", loi);
        }
        return ketQua;
    }
    const KHOA_LUU_LICH_SU = "sinhvien_lichsu";
     function taiLichSu() {
        let ketQua = [];
        try {
            const chuoiDaLuu = localStorage.getItem(KHOA_LUU_LICH_SU);
            if (chuoiDaLuu !== null) {
                const daDoc = JSON.parse(chuoiDaLuu);
                if (Array.isArray(daDoc)) ketQua = daDoc;
            }
        } 
        catch (loi) {
            console.log("Không đọc được lịch sử:", loi);
        }
        return ketQua;
    }
    let dsLichSu = taiLichSu();   
    // ===== 2. HÀM TIỆN ÍCH =====
    function maHoaHTML(chuoi) {
        if (chuoi === undefined || chuoi === null) {
            return "";
        }
        let ketQua = String(chuoi);                  
        ketQua = ketQua.replaceAll("&", "&amp;");    
        ketQua = ketQua.replaceAll("<", "&lt;");     
        ketQua = ketQua.replaceAll(">", "&gt;");  
        ketQua = ketQua.replaceAll('"', "&quot;");   // thay MỌI dấu " bằng &quot;
        return ketQua;
    }
    function dinhDangNgay(ngayISO) {
        if (!ngayISO) {
            return "";
        }
        const cacPhan = ngayISO.split("-");   
        const nam = cacPhan[0];               
        const thang = cacPhan[1];
        const ngay = cacPhan[2];
        return ngay + "/" + thang + "/" + nam;   
    }
    function hienThongBao(loai, noiDung) {  
        const thongBao = document.createElement("div");
        if (loai === "error") {
            thongBao.className = "toast error";
        } else {
            thongBao.className = "toast";
        }
        thongBao.textContent = noiDung;
        const hop = layPhanTu("svToast");
        hop.appendChild(thongBao);
        setTimeout(function () {
            thongBao.remove();
        }, 2500);
    }
    function timSinhVien(ma) {
        for (let i = 0; i < dsSinhVien.length; i++) {
            if (dsSinhVien[i].maSV === ma) {
                return dsSinhVien[i];
            }
        }
        return null;  
    }
    function themLichSu(loai, noiDung) {
        dsLichSu.unshift({ loai: loai, noiDung: noiDung, thoiGian: new Date().toLocaleString("vi-VN") });
        if (dsLichSu.length > 100) {
            dsLichSu.length = 100;   // chỉ giữ 100 dòng gần nhất
        }
        try { localStorage.setItem(KHOA_LUU_LICH_SU, JSON.stringify(dsLichSu)); }
        catch (loi) { console.log("Không lưu được lịch sử:", loi); }
    }
    function hienThiLichSu() {
        const ul = layPhanTu("svHistoryList");
        if (dsLichSu.length === 0) {
            ul.innerHTML = '<li class="history-empty">Chưa có thao tác nào.</li>';
            return;
        }
        let html = "";
        for (let i = 0; i < dsLichSu.length; i++) {
            const m = dsLichSu[i];
            let lop = "log-tag";
            if (m.loai === "Thêm") lop += " log-add";
            else if (m.loai === "Sửa") lop += " log-edit";
            else if (m.loai === "Xóa") lop += " log-delete";
            html += '<li><span class="' + lop + '">' + maHoaHTML(m.loai) + '</span>' +
                    '<div>' + maHoaHTML(m.noiDung) + '<br><small>' + maHoaHTML(m.thoiGian) + '</small></div></li>';
        }
        ul.innerHTML = html;
    }

    // ===== 3. TÌM KIẾM, LỌC, SẮP XẾP =====
    function layDanhSachLoc() {
        const tuKhoa = layPhanTu("svSearch").value.trim().toLowerCase();
        const trangThai = layPhanTu("svStatusFilter").value;  
        const kieuSapXep = layPhanTu("svSort").value;       
        const ketQua = [];  
        for (let i = 0; i < dsSinhVien.length; i++) {
            const sv = dsSinhVien[i];   
            const chuoiTim = [sv.maSV, sv.hoTen, sv.lop, sv.nganh, sv.email].join(" ").toLowerCase();
            const khopTuKhoa = chuoiTim.includes(tuKhoa);  
            const khopTrangThai = (trangThai === "" || sv.trangThai === trangThai);   
            if (khopTuKhoa && khopTrangThai) {
                ketQua.push(sv);  
            }
        }
        if (kieuSapXep === "new") {
            ketQua.reverse();   
        } 
        else if (kieuSapXep === "name") {
            ketQua.sort(
                function (a, b) {
                return a.hoTen.localeCompare(b.hoTen, "vi");   
                }
            );
        } else if (kieuSapXep === "code") {
            ketQua.sort(function (a, b) {
                return a.maSV.localeCompare(b.maSV, "vi", { numeric: true }); 
            });
        }
        return ketQua;  
    }
    // ===== 4. HIỂN THỊ BẢNG VÀ PHÂN TRANG =====
    function hienThiDanhSach() {
        const dsLoc = layDanhSachLoc();  
        let tongSoTrang = Math.ceil(dsLoc.length / SO_DONG_MOI_TRANG);
        if (tongSoTrang < 1) 
        {
            tongSoTrang = 1;              
        }
        if (trangHienTai > tongSoTrang) 
        {
            trangHienTai = tongSoTrang;
        }
        const viTriBatDau = (trangHienTai - 1) * SO_DONG_MOI_TRANG;
        const viTriKetThuc = viTriBatDau + SO_DONG_MOI_TRANG;
        const dsTrangNay = dsLoc.slice(viTriBatDau, viTriKetThuc);
        // tạo nội dung HTML của bảng 
        let html = "";  
        if (dsTrangNay.length === 0) 
        {
            html = '<tr><td class="empty" colspan="10">Không có sinh viên nào.</td></tr>';
        } 
        else 
        {
            for (let i = 0; i < dsTrangNay.length; i++) 
            {
                const sv = dsTrangNay[i];
                const ma = maHoaHTML(sv.maSV);
                const stt = viTriBatDau + i + 1;  
                let lopMau = LOP_TRANG_THAI[sv.trangThai];
                if (!lopMau) {
                    lopMau = "status";
                }
                html += "<tr>";
                html += "<td>" + stt + "</td>";
                html += "<td>" + ma + "</td>";
                html += "<td>" + maHoaHTML(sv.hoTen) + "</td>";
                html += "<td>" + maHoaHTML(sv.gioiTinh) + "</td>";
                html += "<td>" + dinhDangNgay(sv.ngaySinh) + "</td>";
                html += "<td>" + maHoaHTML(sv.lop) + "</td>";
                html += "<td>" + maHoaHTML(sv.nganh) + "</td>";
                html += "<td>" + maHoaHTML(sv.email) + "</td>";
                html += '<td><span class="' + lopMau + '">' + maHoaHTML(sv.trangThai) + "</span></td>";

                html += '<td class="actions">';
                html += '<button type="button" data-hanhdong="sua" data-ma="' + ma + '">Sửa</button>';
                html += '<button type="button" class="danger" data-hanhdong="xoa" data-ma="' + ma + '">Xóa</button>';
                html += "</td>";
                html += "</tr>";
            }
        }
        thanBang.innerHTML = html;   
        const tuKhoa = layPhanTu("svSearch").value.trim();
        const trangThai = layPhanTu("svStatusFilter").value;
        layPhanTu("svCount").textContent = dsSinhVien.length + " sinh viên";   
        if (tuKhoa === "" && trangThai === "") {
            layPhanTu("svMessage").textContent = "Đang hiển thị toàn bộ sinh viên.";
        } 
        else {
            layPhanTu("svMessage").textContent = "Tìm thấy " + dsLoc.length + " sinh viên phù hợp.";
        }
        layPhanTu("svPage").textContent = "Trang " + trangHienTai + "/" + tongSoTrang;
        layPhanTu("svPrev").disabled = (trangHienTai <= 1);             
        layPhanTu("svNext").disabled = (trangHienTai >= tongSoTrang);   
    }

    // ===== 5. THÊM / SỬA / XÓA =====
    function moHopThoai(ma) {
        let sv = null;
        if (ma) {
            sv = timSinhVien(ma);
            maDangSua = ma;       
        } 
        else {
            maDangSua = null;     
        }
        let maSV = "";
        let hoTen = "";
        let gioiTinh = "Nam";
        let ngaySinh = "";
        let lop = "";
        let nganh = "";
        let email = "";
        let trangThai = "Đang học";
        if (sv !== null) {
            maSV = sv.maSV;
            hoTen = sv.hoTen;
            gioiTinh = sv.gioiTinh;
            ngaySinh = sv.ngaySinh;
            lop = sv.lop;
            nganh = sv.nganh;
            email = sv.email;
            trangThai = sv.trangThai;
        }
        if (sv !== null) {
            layPhanTu("svModalTitle").textContent = "Sửa sinh viên";
        } else {
            layPhanTu("svModalTitle").textContent = "Thêm sinh viên";
        }
        layPhanTu("svCode").value = maSV;
        layPhanTu("svName").value = hoTen;
        layPhanTu("svBirth").value = ngaySinh;
        layPhanTu("svClass").value = lop;
        layPhanTu("svMajor").value = nganh;
        layPhanTu("svEmail").value = email;
        layPhanTu("svState").value = trangThai;
        document.querySelector('input[name="svGender"][value="' + gioiTinh + '"]').checked = true;
        layPhanTu("svCode").disabled = (sv !== null);
        layPhanTu("svModal").hidden = false;
        if (sv !== null) {
            layPhanTu("svName").focus();   
        } 
        else {
            layPhanTu("svCode").focus();   
        }
    };
    function dongHopThoai() {
        layPhanTu("svModal").hidden = true;   
    }
    function luuSinhVien() {
        const sv = {
            maSV: layPhanTu("svCode").value.trim(),     
            hoTen: layPhanTu("svName").value.trim(),
            gioiTinh: document.querySelector('input[name="svGender"]:checked').value,   
            ngaySinh: layPhanTu("svBirth").value,
            lop: layPhanTu("svClass").value.trim(),
            nganh: layPhanTu("svMajor").value.trim(),
            email: layPhanTu("svEmail").value.trim(),
            trangThai: layPhanTu("svState").value
        };
        if (!sv.maSV) {
            hienThongBao("error", "Mã sinh viên không được để trống");
            return;   
        }
        if (!sv.hoTen) {
            hienThongBao("error", "Họ và tên không được để trống");
            return;
        }
        if (!sv.ngaySinh) {
            hienThongBao("error", "Vui lòng chọn ngày sinh");
            return;
        }
        if (!sv.lop) {
            hienThongBao("error", "Lớp không được để trống");
            return;
        }
        if (!sv.nganh) {
            hienThongBao("error", "Ngành không được để trống");
            return;
        }
        if (!sv.email.includes("@")) {   
            hienThongBao("error", "Email chưa đúng định dạng");
            return;
        }
        if (maDangSua === null) {
            let biTrung = false;
            for (let i = 0; i < dsSinhVien.length; i++) {
                if (dsSinhVien[i].maSV.toLowerCase() === sv.maSV.toLowerCase()) {
                    biTrung = true;
                }
            }
            if (biTrung) {
                hienThongBao("error", "Mã sinh viên đã tồn tại");
                return;
            }
            dsSinhVien.push(sv);   
            themLichSu("Thêm", "Thêm sinh viên " + sv.hoTen + " (" + sv.maSV + ")");
            hienThongBao("ok", "Thêm sinh viên thành công");

        } else {
            const svCu = timSinhVien(maDangSua);
            if (svCu === null) {
                hienThongBao("error", "Không tìm thấy sinh viên cần sửa");
                return;
            }
            svCu.hoTen = sv.hoTen;          
            svCu.gioiTinh = sv.gioiTinh;
            svCu.ngaySinh = sv.ngaySinh;
            svCu.lop = sv.lop;
            svCu.nganh = sv.nganh;
            svCu.email = sv.email;
            svCu.trangThai = sv.trangThai;
            themLichSu("Sửa", "Sửa thông tin sinh viên " + sv.hoTen + " (" + sv.maSV + ")");
            hienThongBao("ok", "Cập nhật sinh viên thành công");
        }
        luuDanhSachSinhVien();
        dongHopThoai();
        hienThiDanhSach();
    }
    function xoaSinhVien(ma) {
        const sv = timSinhVien(ma);
        if (sv === null) {
            return;   
        }
        const dongY = confirm("Bạn có chắc muốn xóa sinh viên " + sv.hoTen + "?");
        if (!dongY) {
            return;   
        }
        const dsMoi = [];
        for (let i = 0; i < dsSinhVien.length; i++) {
            if (dsSinhVien[i].maSV !== ma) {
                dsMoi.push(dsSinhVien[i]);
            }
        }
        dsSinhVien = dsMoi;   
        themLichSu("Xóa", "Xóa sinh viên " + sv.hoTen + " (" + sv.maSV + ")");
        luuDanhSachSinhVien();
        hienThiDanhSach();
        hienThongBao("ok", "Xóa sinh viên thành công");
    }

    // ===== 6. GẮN SỰ KIỆN =====
    layPhanTu("svAddBtn").addEventListener("click", function () { moHopThoai(null); });
    layPhanTu("svSave").addEventListener("click", luuSinhVien);
    layPhanTu("svCancel").addEventListener("click", dongHopThoai);
    layPhanTu("svModal").addEventListener("click", function (suKien) { if (suKien.target === layPhanTu("svModal")) dongHopThoai(); });
    document.addEventListener("keydown", function (suKien) { if (suKien.key === "Escape") { dongHopThoai(); layPhanTu("svHistoryModal").hidden = true; } });
    thanBang.addEventListener(
        "click", function (suKien) {
            const nut = suKien.target.closest("button[data-hanhdong]");
            if (!nut) return;
            if (nut.dataset.hanhdong === "sua") moHopThoai(nut.dataset.ma);
            else xoaSinhVien(nut.dataset.ma);
        }
    );
    ["svSearch", "svStatusFilter", "svSort"].forEach(
        function (id) {
            layPhanTu(id).addEventListener("input", function () { trangHienTai = 1; hienThiDanhSach(); });
        }
    );
    layPhanTu("svSearchBtn").addEventListener("click", function () { trangHienTai = 1; hienThiDanhSach(); });
    layPhanTu("svClearBtn").addEventListener("click", function () {
        layPhanTu("svSearch").value = "";
        layPhanTu("svStatusFilter").value = "";
        trangHienTai = 1;
        hienThiDanhSach();
        layPhanTu("svSearch").focus();
    });
    layPhanTu("svPrev").addEventListener("click", function () { trangHienTai--; hienThiDanhSach(); });
    layPhanTu("svNext").addEventListener("click", function () { trangHienTai++; hienThiDanhSach(); });
    // Nút Lịch sử
    layPhanTu("svHistoryBtn").addEventListener("click", function () { hienThiLichSu(); layPhanTu("svHistoryModal").hidden = false; });
    layPhanTu("svHistoryClose").addEventListener("click", function () { layPhanTu("svHistoryModal").hidden = true; });
    layPhanTu("svHistoryModal").addEventListener("click", function (suKien) { if (suKien.target === layPhanTu("svHistoryModal")) layPhanTu("svHistoryModal").hidden = true; });
    layPhanTu("svHistoryClear").addEventListener("click", function () {
        if (dsLichSu.length === 0 || !confirm("Xóa toàn bộ lịch sử thao tác?")) return;
        dsLichSu = [];
        try { localStorage.removeItem(KHOA_LUU_LICH_SU); } catch (loi) { console.log(loi); }
        hienThiLichSu();
    });

    hienThiDanhSach();
}