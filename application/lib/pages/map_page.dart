import 'package:civic_pulse/consts/marker_colors.dart';
import 'package:civic_pulse/core/map_mode.dart';
import 'package:civic_pulse/core/problem_providers.dart';
import 'package:civic_pulse/utils/location_service.dart';
import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import 'package:provider/provider.dart';

class MapPage extends StatefulWidget {
  final MapMode mode;

  const MapPage({
    super.key,
    required this.mode,
  });

  @override
  State<MapPage> createState() => _MapPageState();
}

class _MapPageState extends State<MapPage> {
  final MapController mapController = MapController();

  LatLng? currentLocation;
  LatLng? selectedLocation;
  bool locationLoaded = false;

  @override
  void initState() {
    super.initState();
    _loadCurrentLocation();
  }

  Future<void> _loadCurrentLocation() async {
    final position = await LocationService.getCurrentLocation();

    if (position != null) {
      final latLng = LatLng(position.latitude, position.longitude);

      setState(() {
        currentLocation = latLng;
        locationLoaded = true;
      });

      WidgetsBinding.instance.addPostFrameCallback((_) {
        mapController.move(latLng, 16);
      });
    } else {
      setState(() {
        locationLoaded = true;
      });
    }
  }

  void _showProblemDetails(BuildContext context, problem) {
    showModalBottomSheet(
      context: context,
      backgroundColor: const Color(0xFF0F172A),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (_) {
        return Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                problem.title,
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                problem.description,
                style: const TextStyle(color: Colors.white70),
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 10,
                      vertical: 4,
                    ),
                    decoration: BoxDecoration(
                      color: MarkerColors.fromCategory(problem.category)
                          // ignore: deprecated_member_use
                          .withOpacity(0.2),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Text(
                      problem.category,
                      style: TextStyle(
                        color:
                            MarkerColors.fromCategory(problem.category),
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Text(
                    problem.status.toUpperCase(),
                    style: TextStyle(
                      color: problem.status == 'resolved'
                          ? Colors.greenAccent
                          : Colors.orangeAccent,
                      fontWeight: FontWeight.bold,
                      fontSize: 12,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 10),
              Text(
                problem.locationText,
                style: const TextStyle(
                  color: Colors.white38,
                  fontSize: 12,
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final problemsProvider = context.watch<ProblemsProvider>();

    return Scaffold(
      backgroundColor: const Color(0xFF0F172A),
      appBar: AppBar(
        leading: const BackButton(color: Colors.white),
        title: Text(
          widget.mode == MapMode.view ? 'Live Map' : 'Select Location',
          style: const TextStyle(color: Colors.white),
        ),
        backgroundColor: Colors.transparent,
        elevation: 0,
        centerTitle: true,
      ),
      body: locationLoaded
          ? Stack(
              children: [
                FlutterMap(
                  mapController: mapController,
                  options: MapOptions(
                    initialCenter: const LatLng(26.1445, 91.7362),
                    initialZoom: 14,
                    onTap: widget.mode == MapMode.select
                        ? (tapPosition, point) {
                            setState(() {
                              selectedLocation = point;
                            });
                          }
                        : null,
                  ),
                  children: [
                    TileLayer(
                      urlTemplate:
                          'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                      userAgentPackageName: 'com.example.civic_pulse',
                    ),
                    MarkerLayer(
                      markers: [
                        if (currentLocation != null)
                          Marker(
                            point: currentLocation!,
                            width: 40,
                            height: 40,
                            child: const Icon(
                              Icons.my_location,
                              color: Colors.blueAccent,
                              size: 32,
                            ),
                          ),

                        if (widget.mode == MapMode.select &&
                            selectedLocation != null)
                          Marker(
                            point: selectedLocation!,
                            width: 40,
                            height: 40,
                            child: const Icon(
                              Icons.location_pin,
                              color: Colors.redAccent,
                              size: 40,
                            ),
                          ),

                        if (widget.mode == MapMode.view)
                          ...problemsProvider.problems.map(
                            (problem) => Marker(
                              point: LatLng(
                                problem.latitude,
                                problem.longitude,
                              ),
                              width: 40,
                              height: 40,
                              child: GestureDetector(
                                onTap: () =>
                                    _showProblemDetails(context, problem),
                                child: Icon(
                                  Icons.location_pin,
                                  color: MarkerColors.fromCategory(
                                      problem.category),
                                  size: 40,
                                ),
                              ),
                            ),
                          ),
                      ],
                    ),
                  ],
                ),

                if (widget.mode == MapMode.select)
                  Positioned(
                    bottom: 20,
                    left: 20,
                    right: 20,
                    child: ElevatedButton(
                      onPressed: selectedLocation == null
                          ? null
                          : () {
                              Navigator.pop(context, selectedLocation);
                            },
                      style: ElevatedButton.styleFrom(
                        padding:
                            const EdgeInsets.symmetric(vertical: 14),
                        backgroundColor: Colors.blueAccent,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      child: const Text(
                        'Confirm Location',
                        style: TextStyle(fontSize: 16),
                      ),
                    ),
                  ),
              ],
            )
          : const Center(
              child:
                  CircularProgressIndicator(color: Colors.blueAccent),
            ),
      floatingActionButton: FloatingActionButton(
        backgroundColor: Colors.blueAccent,
        onPressed: _loadCurrentLocation,
        child: const Icon(Icons.my_location),
      ),
    );
  }
}
