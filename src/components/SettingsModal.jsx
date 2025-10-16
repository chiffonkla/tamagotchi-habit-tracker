import { X } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function SettingsModal({ isOpen, onClose, userName, setUserName, theme, setTheme, onSave, onReset }) {
  const [locationError, setLocationError] = useState(null)
  const [latitude, setLatitude] = useState("")
  const [longitude, setLongitude] = useState("")
  const [accuracy, setAccuracy] = useState(null)
  const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone)
  const [originalTimezone, setOriginalTimezone] = useState(timezone)
  const [originalName, setOriginalName] = useState(userName)
  const [isSaving, setIsSaving] = useState(false)

  // Initialize original values when modal opens
  useEffect(() => {
    if (isOpen) {
      setOriginalName(userName)
      setOriginalTimezone(timezone)
      fetchCurrentLocation()
    }
  }, [isOpen, userName, timezone])

  const fetchCurrentLocation = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_DOMAIN}/api/get-location`, {
        method: "GET",
        credentials: "include",
      })

      if (response.ok) {
        const data = await response.json()
        if (data.status === "ok" && data.location) {
          setLatitude(data.location.latitude.toString())
          setLongitude(data.location.longitude.toString())
          setAccuracy(data.location.accuracy)
        }
      }
    } catch (error) {
      console.error("Error fetching current location:", error)
      // Don't show error to user, just leave fields empty
    }
  }

  const handleSetLocationAutomatically = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.")
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords
        setLatitude(latitude)
        setLongitude(longitude)
        setAccuracy(accuracy)

        try {
          const response = await fetch(`${import.meta.env.VITE_API_DOMAIN}/api/set-location`, {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ latitude, longitude, accuracy }),
          })

          if (!response.ok) {
            throw new Error("Failed to update location.")
          }

          setLocationError(null)
          console.log("Location updated successfully.")
        } catch (err) {
          console.error("Error sending location to API:", err)
          setLocationError("Failed to update location automatically.")
        }
      },
      (error) => {
        console.error("Error getting geolocation:", error)
        setLocationError("Unable to retrieve your location. Please set it manually.")
      }
    )
  }

  const handleSetLocationManually = async () => {
    if (!latitude || !longitude) {
      setLocationError("Please provide both latitude and longitude.")
      return
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_DOMAIN}/api/set-location`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ latitude: parseFloat(latitude), longitude: parseFloat(longitude), accuracy: null }),
      })

      if (!response.ok) {
        throw new Error("Failed to update location.")
      }

      setLocationError(null)
      console.log("Location updated successfully.")
      window.location.reload()
    } catch (err) {
      console.error("Error sending location to API:", err)
      alert("Failed to update location manually");
      setLocationError("Failed to update location manually. Ensure your inputs are valid latitude and longitude coordinates");
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Save display name
      const nameResponse = await fetch(`${import.meta.env.VITE_API_DOMAIN}/api/profile/update`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          display_name: userName,
        }),
      })

      if (!nameResponse.ok) {
        throw new Error("Failed to update display name")
      }

      // Save timezone
      const timezoneResponse = await fetch(`${import.meta.env.VITE_API_DOMAIN}/api/profile/update`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          timezone: timezone,
        }),
      })

      if (!timezoneResponse.ok) {
        throw new Error("Failed to update timezone")
      }

      // Update original values after successful save
      setOriginalName(userName)
      setOriginalTimezone(timezone)
      
      // Call the parent's onSave function
      onSave()
    } catch (error) {
      console.error("Error saving changes:", error)
      alert("Failed to save changes. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleReset = () => {
    setUserName(originalName)
    setTimezone(originalTimezone)
    onReset()
  }

  if (!isOpen) return null

  return (
    <>
      <div
        className="fixed inset-0 bg-black/20 z-40"
        onClick={onClose}
      />
      {/* Main Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none p-4">
        <div
          className="bg-white rounded-lg p-6 max-w-sm w-full relative pointer-events-auto shadow-lg animate-fadeIn max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-6 sticky top-0 bg-white pb-2">
            <h2 className="text-lg font-medium text-gray-800">Settings</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors text-3xl font-light">
              ×
            </button>
          </div>

          <div className="space-y-6">
            {/* Name Section */}
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Display Name
              </label>
              <input
                type="text"
                id="name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-transparent"
              />
            </div>

            {/* Timezone Section */}
            <div className="space-y-2">
              <label htmlFor="timezone" className="block text-sm font-medium text-gray-700">
                Timezone
              </label>
              <select
                id="timezone"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-transparent"
              >
                {Intl.supportedValuesOf('timeZone').map((zone) => (
                  <option key={zone} value={zone}>
                    {zone}
                  </option>
                ))}
              </select>
            </div>

            {/* Theme Section */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Theme</label>
              <div className="flex gap-3">
                <button
                  onClick={() => setTheme("light")}
                  className={`px-4 py-1.5 rounded-full text-sm transition-all ${
                    theme === "light"
                      ? "bg-white border-2 border-purple-200 text-purple-600"
                      : "bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-600"
                  }`}
                >
                  Light
                </button>
                <button
                  onClick={() => setTheme("dark")}
                  className={`px-4 py-1.5 rounded-full text-sm transition-all ${
                    theme === "dark"
                      ? "bg-gray-800 text-white border-2 border-gray-600"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                  }`}
                >
                  Dark
                </button>
              </div>
            </div>

            {/* Change Pet Section */}
            {/* <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Change Pet</label>
              <button className="w-full bg-[#cce5ff] text-gray-700 px-4 py-2 rounded-full text-sm hover:bg-[#b8d4f0] transition-colors border border-[#b8d4f0]">
                Choose New Pet
              </button>
            </div> */}

            {/* Location Section */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-700">Set Location</h3>
              {locationError && <div className="text-red-500 text-sm">{locationError}</div>}
              <button
                onClick={handleSetLocationAutomatically}
                className="w-full bg-[#c8c6ff] text-gray-700 px-4 py-2 rounded-full text-sm hover:bg-[#b5b3e6] transition-colors border border-[#b5b3e6]"
              >
                Set Location Automatically
              </button>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Latitude"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Longitude"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  className="w-full border border-gray-400 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-transparent"
                />
                <button
                  onClick={handleSetLocationManually}
                  className="w-full bg-[#cbffc6] text-gray-700 px-4 py-2 rounded-full text-sm hover:bg-[#b8edb3] transition-colors border border-[#b8edb3]"
                >
                  Set Manually
                </button>
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-4">
              <button
                onClick={handleReset}
                className="px-3 py-1.5 text-gray-700 hover:bg-gray-100 rounded text-sm"
              >
                Reset
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-[#e79c2d] text-gray-100 px-4 py-1.5 rounded text-sm hover:bg-[#d38c1d] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
