package backend.PIT.model;

public class DashboardResumen {
    private int totalProductos;
    private int productosBajoStock;
    private int productosPorVencer;
    private int productosCriticos;

    public int getTotalProductos() { return totalProductos; }
    public void setTotalProductos(int totalProductos) { this.totalProductos = totalProductos; }
    public int getProductosBajoStock() { return productosBajoStock; }
    public void setProductosBajoStock(int productosBajoStock) { this.productosBajoStock = productosBajoStock; }
    public int getProductosPorVencer() { return productosPorVencer; }
    public void setProductosPorVencer(int productosPorVencer) { this.productosPorVencer = productosPorVencer; }
    public int getProductosCriticos() { return productosCriticos; }
    public void setProductosCriticos(int productosCriticos) { this.productosCriticos = productosCriticos; }
}
