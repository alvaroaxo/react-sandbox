import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createPost,
  deletePost,
  fetchPosts,
  updatePost,
} from "./postsSlice.js";

const emptyForm = {
  title: "",
  body: "",
  userId: 1,
};

export default function App() {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((state) => state.posts);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  const submitLabel = useMemo(() => {
    return editingId ? "Actualizar" : "Crear";
  }, [editingId]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "userId" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formData.title.trim() || !formData.body.trim()) {
      return;
    }

    if (editingId) {
      await dispatch(updatePost({ id: editingId, ...formData }));
    } else {
      await dispatch(createPost(formData));
    }

    setFormData(emptyForm);
    setEditingId(null);
  };

  const handleEdit = (post) => {
    setFormData({
      title: post.title,
      body: post.body,
      userId: post.userId ?? 1,
    });
    setEditingId(post.id);
  };

  const handleCancel = () => {
    setFormData(emptyForm);
    setEditingId(null);
  };

  return (
    <div className="min-h-screen px-6 py-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <header className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
            React + Vite · Redux · Axios · Tailwind
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">
            CRUD con JSONPlaceholder
          </h1>
          <p className="mt-2 text-slate-600">
            Crea, edita y elimina publicaciones consumiendo la API pública de
            JSONPlaceholder.
          </p>
        </header>

        <section className="grid gap-8 lg:grid-cols-[360px,1fr]">
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl bg-white p-6 shadow-sm"
          >
            <h2 className="text-lg font-semibold text-slate-900">
              {editingId ? "Editar publicación" : "Nueva publicación"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Completa los campos para enviar a la API.
            </p>

            <div className="mt-6 space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-slate-700">
                  Título
                </span>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Ej. Proyecto de CRUD"
                  className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-700">
                  Contenido
                </span>
                <textarea
                  name="body"
                  value={formData.body}
                  onChange={handleChange}
                  placeholder="Describe la publicación..."
                  rows={5}
                  className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-700">
                  Usuario
                </span>
                <select
                  name="userId"
                  value={formData.userId}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                >
                  {[1, 2, 3, 4, 5].map((id) => (
                    <option key={id} value={id}>
                      Usuario {id}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="submit"
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
              >
                {submitLabel}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Publicaciones
                </h2>
                <p className="text-sm text-slate-500">
                  {status === "loading"
                    ? "Cargando datos..."
                    : "Mostrando publicaciones recientes."}
                </p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                Total: {items.length}
              </span>
            </div>

            {error && (
              <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {items.map((post) => (
                <article
                  key={post.id}
                  className="flex h-full flex-col rounded-xl border border-slate-100 bg-slate-50 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase text-slate-400">
                        Usuario {post.userId}
                      </p>
                      <h3 className="mt-2 text-base font-semibold text-slate-900">
                        {post.title}
                      </h3>
                    </div>
                    <span className="rounded-full bg-white px-2 py-1 text-xs text-slate-500">
                      #{post.id}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-slate-600">
                    {post.body}
                  </p>
                  <div className="mt-4 flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(post)}
                      className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-white"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => dispatch(deletePost(post.id))}
                      className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                    >
                      Eliminar
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
