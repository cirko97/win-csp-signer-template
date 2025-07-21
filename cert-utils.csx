using System;
using System.Collections.Generic;
using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;

public class Startup {
    public async Task<object> Invoke(dynamic input) {
        List<object> certs = new List<object>();
        X509Store store = new X509Store(StoreLocation.CurrentUser);
        store.Open(OpenFlags.ReadOnly);
        foreach (X509Certificate2 cert in store.Certificates) {
            if (cert.HasPrivateKey) {
                certs.Add(new {
                    Subject = cert.Subject,
                    Thumbprint = cert.Thumbprint,
                    NotBefore = cert.NotBefore,
                    NotAfter = cert.NotAfter
                });
            }
        }
        store.Close();
        return certs;
    }
}