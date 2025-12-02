import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

const ModalForgetPass = () => {
    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    
    const handleOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data: { token?: string; user?: any; message?: string } =
                await res.json();

            if (res.ok && data.token) {
                localStorage.setItem("token", data.token); // store JWT
                alert("Logged in successfully!");
                navigate("/dashboard"); // or any protected page
            } else {
                alert(data.message || "Invalid credentials");
            }
        } catch (err) {
            console.error(err);
            alert("Server error");
        } finally {
            setLoading(false);
        }
    };



  return (
    <div>
        <button onClick={handleOpen}>Open Modal</button>
        {open && (
            <div>
                <form onSubmit={handleLogin}>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <button type="submit">Submit</button>
                </form>
            </div>
        )}
    </div>
  )
}

export default ModalForgetPass