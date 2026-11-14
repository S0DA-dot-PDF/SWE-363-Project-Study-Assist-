import { useState } from "react";
import { Link } from "react-router-dom";

function AdvertisementManagement({
  advertisements,
  setAdvertisements,
  setActiveAdvertisement,
}) {
  const [error, setError] = useState("");
  const [previewAdvertisement, setPreviewAdvertisement] = useState(null);

function handleUpload(event) {
  const file = event.target.files[0];

  if (!file) {
    return;
  }

  const isImage = file.type.startsWith("image/");
  const isVideo = file.type.startsWith("video/");

  if (!isImage && !isVideo) {
    setError("Only image and video files are allowed.");
    return;
  }

  const newAdvertisement = {
    id: Date.now(),
    name: file.name,
    type: file.type,
    url: URL.createObjectURL(file),
  };

  setPreviewAdvertisement(newAdvertisement);
  setError("");
}

function selectAdvertisement(advertisement) {
  const confirmed = window.confirm(
    "Publish this advertisement on user dashboards?"
  );

  if (confirmed) {
    setActiveAdvertisement(advertisement);

    if (!advertisements.some((ad) => ad.id === advertisement.id)) {
      setAdvertisements([...advertisements, advertisement]);
    }

    setPreviewAdvertisement(null);
  }
}

  return (
      <main className="advertisement-page">
    <div className="d-flex justify-content-between align-items-start mb-4">
      <div>
        <h1>Advertisement Management</h1>
        <p>Upload and select advertisements for user dashboards.</p>
      </div>

      <Link to="/admin-dashboard" className="btn btn-outline-primary">
        Back to Admin Dashboard
      </Link>
    </div>

      <section className="card p-4 mb-4">
        <h2 className="h5">Upload New Advertisement</h2>

        <label htmlFor="advertisement-file" className="form-label">
          Choose an image or video
        </label>

        <input
          id="advertisement-file"
          className="form-control"
          type="file"
          accept="image/*,video/*"
          onChange={handleUpload}
        />

        {error && <p className="error-message">{error}</p>}
      </section>

      <div className="row g-4">
        <section className="col-md-8">
          {previewAdvertisement ? (
            <div className="card p-3">
              <h2>Advertisement Preview</h2>

              {previewAdvertisement.type.startsWith("image/") ? (
                <img
                  src={previewAdvertisement.url}
                  alt="Advertisement preview"
                  className="img-fluid rounded"
                />
              ) : (
                <video
                  src={previewAdvertisement.url}
                  className="w-100 rounded"
                  controls
                />
              )}

              <button
                type="button"
                className="btn btn-primary mt-2"
                onClick={() =>
                  selectAdvertisement(previewAdvertisement)
                }
              >
                Publish Advertisement
              </button>
            </div>
          ) : (
            <p>Upload or select an advertisement to preview it.</p>
          )}
        </section>

        <aside className="col-md-4">
          <h2>Previous Advertisements</h2>

          {advertisements.length === 0 ? (
            <p>No advertisements have been published.</p>
          ) : (
            advertisements.map((advertisement) => (
              <button
                key={advertisement.id}
                type="button"
                className="btn btn-light w-100 text-start mb-2"
                onClick={() =>
                  setPreviewAdvertisement(advertisement)
                }
              >
                {advertisement.name}
              </button>
            ))
          )}
        </aside>
      </div>
    </main>
  );
}

export default AdvertisementManagement;