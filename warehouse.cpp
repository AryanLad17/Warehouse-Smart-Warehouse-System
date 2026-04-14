#include <iostream>
#include <vector>
#include <algorithm>
#include <queue>
using namespace std;

struct node {
    string Name;
    int quant;
    int Location;
    node *right;
    node *left;
};

struct Edge {
    int u, v, w;
};

struct node1 {
    int v;
    int distance;
    node1 *next;
};

class Warehouse {
    node1 *A[5];
    int parent[5];
    int w[5][5], v[5], f[5], d[5];
    vector<Edge> edges;

    int find(int x) {
        if (parent[x] != x)
            parent[x] = find(parent[x]);
        return parent[x];
    }

    void unite(int x, int y) {
        parent[find(x)] = find(y);
    }

    void printPath(int dest) {
        if (dest == -1) return;
        printPath(f[dest]);
        cout << dest << " ";
    }

public:
    Warehouse() {
        for (int i = 0; i < 5; i++) {
            A[i] = NULL;
            parent[i] = i;
            for (int j = 0; j < 5; j++) {
                w[i][j] = 99;
            }
        }
    }

    node *createnode(string Nam, int Q, int locate) {
        node *nn = new node;
        nn->Name = Nam;
        nn->quant = Q;
        nn->Location = locate;
        nn->left = nn->right = NULL;
        return nn;
    }

    node *insert(node *nn, string name, int quantity, int location) {
        if (nn == NULL)
            return createnode(name, quantity, location);

        if (name < nn->Name)
            nn->left = insert(nn->left, name, quantity, location);
        else if (name > nn->Name)
            nn->right = insert(nn->right, name, quantity, location);

        return nn;
    }

    bool search(node *nn, string name) {
        if (nn == NULL) return false;

        if (name < nn->Name)
            return search(nn->left, name);
        else if (name > nn->Name)
            return search(nn->right, name);
        else
            return nn->quant > 0;
    }

    void update(node *nn, string name, int quan) {
        if (nn == NULL) {
            cout << "Product not found\n";
            return;
        }

        if (name < nn->Name)
            update(nn->left, name, quan);
        else if (name > nn->Name)
            update(nn->right, name, quan);
        else {
            nn->quant += quan;
            cout << "Quantity updated\n";
        }
    }

    void add(int v1, int v2, int wgt) {
        node1 *nn = new node1{v2, wgt, NULL};

        if (A[v1] == NULL)
            A[v1] = nn;
        else {
            node1 *temp = A[v1];
            while (temp->next != NULL)
                temp = temp->next;
            temp->next = nn;
        }
    }

    void edge(int v1, int v2, int distance) {
        add(v1, v2, distance);
        add(v2, v1, distance);
        edges.push_back({v1, v2, distance});
        w[v1][v2] = distance;
        w[v2][v1] = distance;
    }

    void displaylist() {
        for (int i = 0; i < 5; i++) {
            cout << i << " -> ";
            node1 *temp = A[i];
            while (temp != NULL) {
                cout << "(" << temp->distance << ")" << temp->v << " -> ";
                temp = temp->next;
            }
            cout << "NULL\n";
        }
    }

    int findLocation(node *nn, string name) {
        if (nn == NULL) return -1;

        if (name < nn->Name)
            return findLocation(nn->left, name);
        else if (name > nn->Name)
            return findLocation(nn->right, name);
        else
            return nn->Location;
    }

    void bfs(int start) {
        bool visited[5] = {false};
        queue<int> q;

        q.push(start);
        visited[start] = true;

        cout << "BFS: ";

        while (!q.empty()) {
            int u = q.front(); q.pop();
            cout << u << " ";

            node1 *temp = A[u];
            while (temp) {
                if (!visited[temp->v]) {
                    visited[temp->v] = true;
                    q.push(temp->v);
                }
                temp = temp->next;
            }
        }
        cout << endl;
    }

    void kruskalMST() {
        for (int i = 0; i < 5; i++)
            parent[i] = i;

        sort(edges.begin(), edges.end(), [](Edge a, Edge b) {
            return a.w < b.w;
        });

        int cost = 0;

        for (int i = 0; i < edges.size(); i++) {
            Edge e = edges[i];
            if (find(e.u) != find(e.v)) {
                cout << e.u << " -> " << e.v << " : " << e.w << endl;
                cost += e.w;
                unite(e.u, e.v);
            }
        }
        cout << "MST Cost: " << cost << endl;
    }

    void primMST(int start) {
        int parentArray[5];
        int key[5];
        bool mstSet[5];

        for (int i = 0; i < 5; i++) {
            key[i] = 9999;
            mstSet[i] = false;
        }

        key[start] = 0;
        parentArray[start] = -1;

        for (int count = 0; count < 4; count++) {
            int u = -1, min = 9999;
            for (int i = 0; i < 5; i++) {
                if (!mstSet[i] && key[i] < min) {
                    min = key[i];
                    u = i;
                }
            }

            if (u == -1) break;
            mstSet[u] = true;

            for (int vNode = 0; vNode < 5; vNode++) {
                if (w[u][vNode] != 99 && !mstSet[vNode] && w[u][vNode] < key[vNode]) {
                    parentArray[vNode] = u;
                    key[vNode] = w[u][vNode];
                }
            }
        }

        int cost = 0;
        cout << "Prim's MST Edges:\n";
        for (int i = 0; i < 5; i++) {
            if (parentArray[i] != -1) {
                cout << parentArray[i] << " -> " << i << " : " << w[i][parentArray[i]] << endl;
                cost += w[i][parentArray[i]];
            }
        }
        cout << "Prim's MST Cost: " << cost << endl;
    }

    void dij(int start, int dest) {
        for (int i = 0; i < 5; i++) {
            v[i] = 0;
            d[i] = 99;
            f[i] = -1;
        }

        d[start] = 0;

        while (true) {
            int u = -1, min = 99;

            for (int i = 0; i < 5; i++) {
                if (!v[i] && d[i] < min) {
                    min = d[i];
                    u = i;
                }
            }

            if (u == -1) break;

            v[u] = 1;

            for (int i = 0; i < 5; i++) {
                if (!v[i] && w[u][i] != 99 && d[i] > d[u] + w[u][i]) {
                    d[i] = d[u] + w[u][i];
                    f[i] = u;
                }
            }
        }

        cout << "Path: ";
        printPath(dest);
        cout << "\nDistance: " << d[dest] << endl;
    }
};

int main() {
    Warehouse w;
    node *root = NULL;

    int ch;

    do {
        cout << "\n1.Insert 2.Search 3.Update 4.Edge 5.Display 6.Location 7.BFS 8.Kruskal 9.Dijkstra 10.Prim MST 0.Exit\n";
        cin >> ch;

        string name;
        int q, loc, u, v, dist;

        switch (ch) {
            case 1:
                cin >> name >> q >> loc;
                root = w.insert(root, name, q, loc);
                break;

            case 2:
                cin >> name;
                cout << (w.search(root, name) ? "Available\n" : "Not Available\n");
                break;

            case 3:
                cin >> name >> q;
                w.update(root, name, q);
                break;

            case 4:
                cin >> u >> v >> dist;
                w.edge(u, v, dist);
                break;

            case 5:
                w.displaylist();
                break;

            case 6:
                cin >> name;
                cout << "Location: " << w.findLocation(root, name) << endl;
                break;

            case 7:
                cin >> u;
                w.bfs(u);
                break;

            case 8:
                w.kruskalMST();
                break;

            case 9:
                cin >> u >> v;
                w.dij(u, v);
                break;
                
            case 10:
                cin >> u;
                w.primMST(u);
                break;
        }

    } while (ch != 0);
}