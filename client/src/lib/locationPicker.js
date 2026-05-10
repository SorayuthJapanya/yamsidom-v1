import L from "leaflet";
import Swal from "sweetalert2";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export const openLocationPicker = async (currentLatitude, currentLongitude) => {
  let selectedLatitude = currentLatitude;
  let selectedLongitude = currentLongitude;

  const result = await Swal.fire({
    title: "กรุณาเลือกสถานที่",
    html: `
    <input id="location-search" type="text" placeholder="ค้นหาสถานที่" class="swal2-input" />
    <div id="map" style="width: 100%; max-width: 100%; height: 50vh; margin-top: 10px;"></div>
  `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "บันทึก",
    cancelButtonText: "ยกเลิก",
    didOpen: () => {
      const map = L.map("map").setView(
        [selectedLatitude, selectedLongitude],
        8
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      const marker = L.marker([selectedLatitude, selectedLongitude], {
        draggable: true,
      }).addTo(map);

      map.on("click", (e) => {
        const { lat, lng } = e.latlng;
        selectedLatitude = lat;
        selectedLongitude = lng;
        marker.setLatLng([lat, lng]);
      });

      marker.on("dragend", () => {
        const { lat, lng } = marker.getLatLng();
        selectedLatitude = lat;
        selectedLongitude = lng;
      });

      const searchInput = document.getElementById("location-search");
      searchInput.addEventListener("change", async () => {
        const query = searchInput.value;
        if (query) {
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                query
              )}`
            );
            const data = await response.json();
            if (data.length > 0) {
              const { lat, lon } = data[0];
              selectedLatitude = parseFloat(lat);
              selectedLongitude = parseFloat(lon);
              map.setView([selectedLatitude, selectedLongitude], 13);
              marker.setLatLng([selectedLatitude, selectedLongitude]);
            } else {
              Swal.fire(
                "ไม่พบสถานที่",
                "กรุณาลองค้นหาด้วยคำอื่นอีกครั้ง",
                "error"
              );
            }
          } catch (error) {
            Swal.fire(
              error,
              "เกิดข้อผิดพลาด",
              "ไม่สามารถดึงข้อมูลสถานที่ได้",
              "error"
            );
          }
        }
      });
    },
  });

  return result.isConfirmed
    ? { latitude: selectedLatitude, longitude: selectedLongitude }
    : null;
};
